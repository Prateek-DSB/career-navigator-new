// Vector store initialization using MemoryVectorStore (no C++ compilation needed)

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import { AI_CONFIG } from './config.js';

const embeddings = new OpenAIEmbeddings({
  modelName: AI_CONFIG.embeddingModel
});

let vectorStores = {
  jobs: null,
  courses: null,
  stories: null
};

// Initialize vector stores (in-memory)
export async function initializeVectorStores() {
  console.log("Initializing vector stores...");
  
  try {
    console.log("Creating job descriptions vector store...");
    vectorStores.jobs = await createJobVectorStore();
    
    console.log("Creating courses vector store...");
    vectorStores.courses = await createCourseVectorStore();
    
    console.log("Creating transition stories vector store...");
    vectorStores.stories = await createStoriesVectorStore();
    
    console.log("✓ All vector stores ready!");
    return vectorStores;
    
  } catch (error) {
    console.error("Error initializing vector stores:", error);
    throw error;
  }
}

// Create job descriptions vector store
async function createJobVectorStore() {
  const dataPath = path.join(process.cwd(), 'data', 'job_descriptions.csv');
  
  try {
    const csvData = await fs.readFile(dataPath, 'utf-8');
    const parsed = Papa.parse(csvData, { header: true });
    
    const documents = parsed.data
      .filter(row => row.role && row.skills_required)
      .map(row => new Document({
        pageContent: `Role: ${row.role}
Company: ${row.company || 'Various'}
Skills Required: ${row.skills_required}
Experience Level: ${row.experience_level || 'Mid-level'}
Description: ${row.description || ''}`,
        metadata: {
          role: row.role,
          company: row.company,
          skills: row.skills_required,
          experience: row.experience_level
        }
      }));
    
    if (documents.length === 0) {
      throw new Error("No valid job descriptions found");
    }
    
    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
    
    console.log(`✓ Created job vector store with ${documents.length} jobs`);
    return vectorStore;
    
  } catch (error) {
    console.error("Error creating job vector store:", error);
    return await createFallbackJobStore();
  }
}

// Create courses vector store
async function createCourseVectorStore() {
  const dataPath = path.join(process.cwd(), 'data', 'course_catalog.csv');
  
  try {
    const csvData = await fs.readFile(dataPath, 'utf-8');
    const parsed = Papa.parse(csvData, { header: true });
    
    const documents = parsed.data
      .filter(row => row.course_name && row.skills_covered)
      .map(row => new Document({
        pageContent: `Course: ${row.course_name}
Platform: ${row.platform || 'Online'}
Skills: ${row.skills_covered}
Difficulty: ${row.difficulty || 'Intermediate'}
Duration: ${row.duration || 'Self-paced'}
Price: ${row.price || 'Paid'}
Description: ${row.description || ''}`,
        metadata: {
          courseName: row.course_name,
          platform: row.platform,
          url: row.url,
          skills: row.skills_covered,
          difficulty: row.difficulty,
          duration: row.duration,
          price: row.price,
          rating: row.rating
        }
      }));
    
    if (documents.length === 0) {
      throw new Error("No valid courses found");
    }
    
    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
    
    console.log(`✓ Created course vector store with ${documents.length} courses`);
    return vectorStore;
    
  } catch (error) {
    console.error("Error creating course vector store:", error);
    return await createFallbackCourseStore();
  }
}

// Create transition stories vector store
async function createStoriesVectorStore() {
  const dataPath = path.join(process.cwd(), 'data', 'transition_stories.txt');
  
  try {
    const textData = await fs.readFile(dataPath, 'utf-8');
    
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });
    
    const documents = await splitter.createDocuments([textData]);
    
    if (documents.length === 0) {
      throw new Error("No valid transition stories found");
    }
    
    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
    
    console.log(`✓ Created stories vector store with ${documents.length} chunks`);
    return vectorStore;
    
  } catch (error) {
    console.error("Error creating stories vector store:", error);
    return await createFallbackStoriesStore();
  }
}

// Fallback stores with sample data
async function createFallbackJobStore() {
  const sampleJobs = [
    new Document({
      pageContent: "Role: Frontend Developer. Skills: React, JavaScript, HTML, CSS, Git. Experience: Mid-level",
      metadata: { role: "Frontend Developer", skills: "React, JavaScript" }
    }),
    new Document({
      pageContent: "Role: Backend Developer. Skills: Node.js, Express, MongoDB, REST APIs. Experience: Mid-level",
      metadata: { role: "Backend Developer", skills: "Node.js, Express" }
    }),
    new Document({
      pageContent: "Role: Product Manager. Skills: User Research, Roadmapping, Stakeholder Management, Agile. Experience: Mid-level",
      metadata: { role: "Product Manager", skills: "Product Management" }
    })
  ];
  return await MemoryVectorStore.fromDocuments(sampleJobs, embeddings);
}

async function createFallbackCourseStore() {
  const sampleCourses = [
    new Document({
      pageContent: "Course: The Complete React Course. Platform: Udemy. Skills: React, Hooks, State Management. Difficulty: Beginner",
      metadata: { courseName: "The Complete React Course", platform: "Udemy", price: "Paid" }
    }),
    new Document({
      pageContent: "Course: Node.js Complete Guide. Platform: Udemy. Skills: Node.js, Express, MongoDB. Difficulty: Intermediate",
      metadata: { courseName: "Node.js Complete Guide", platform: "Udemy", price: "Paid" }
    })
  ];
  return await MemoryVectorStore.fromDocuments(sampleCourses, embeddings);
}

async function createFallbackStoriesStore() {
  const sampleStories = [
    new Document({
      pageContent: "Sarah transitioned from marketing to product management in 8 months by learning SQL, user research, and product frameworks. Her marketing background helped her understand customer needs better."
    }),
    new Document({
      pageContent: "John moved from teaching to software development in 10 months. His ability to explain complex concepts helped him excel at technical documentation."
    })
  ];
  return await MemoryVectorStore.fromDocuments(sampleStories, embeddings);
}

// Query functions
export async function searchJobs(query, k = AI_CONFIG.vectorStore.topK) {
  if (!vectorStores.jobs) {
    await initializeVectorStores();
  }
  const results = await vectorStores.jobs.similaritySearch(query, k);
  return results;
}

export async function searchCourses(query, k = AI_CONFIG.vectorStore.topK) {
  if (!vectorStores.courses) {
    await initializeVectorStores();
  }
  const results = await vectorStores.courses.similaritySearch(query, k);
  return results;
}

export async function searchTransitionStories(query, k = 3) {
  if (!vectorStores.stories) {
    await initializeVectorStores();
  }
  const results = await vectorStores.stories.similaritySearch(query, k);
  return results;
}

export default {
  initializeVectorStores,
  searchJobs,
  searchCourses,
  searchTransitionStories
};