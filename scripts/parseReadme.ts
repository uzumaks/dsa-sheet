import fs from 'fs';
import path from 'path';

interface ProblemSeed {
  id: string;
  topicId: string;
  title: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
}

interface TopicSeed {
  id: string;
  name: string;
  order: number;
}

const readmePath = path.join(process.cwd(), 'Readme.md');
const content = fs.readFileSync(readmePath, 'utf-8');

const lines = content.split('\n');

const topics: TopicSeed[] = [];
const problems: ProblemSeed[] = [];

let currentTopic: TopicSeed | null = null;
let currentProblemOrder = 1;

// Regex for section headers like: "## 1. Hash Map / Hash Set"
const topicHeaderRegex = /^##\s+(\d+)\.\s+(.+)$/;

// Regex for problem lines like: "1. [Two Sum](https://leetcode.com/problems/two-sum/) (Easy)"
const problemRegex = /^\d+\.\s+\[(.+?)\]\((https?:\/\/[^\s\)]+)\)\s+\((Easy|Medium|Hard)\)/i;

for (const rawLine of lines) {
  const line = rawLine.trim();

  const topicMatch = line.match(topicHeaderRegex);
  if (topicMatch) {
    const orderNum = parseInt(topicMatch[1], 10);
    const topicName = topicMatch[2].trim();
    const topicId = 'topic-' + orderNum + '-' + topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    currentTopic = {
      id: topicId,
      name: topicName,
      order: orderNum,
    };
    topics.push(currentTopic);
    currentProblemOrder = 1;
    continue;
  }

  if (currentTopic) {
    const problemMatch = line.match(problemRegex);
    if (problemMatch) {
      const title = problemMatch[1].trim();
      const url = problemMatch[2].trim();
      const diffStr = problemMatch[3].toLowerCase() as 'easy' | 'medium' | 'hard';

      const problemId = `${currentTopic.id}-p${currentProblemOrder}`;
      problems.push({
        id: problemId,
        topicId: currentTopic.id,
        title,
        url,
        difficulty: diffStr,
        order: currentProblemOrder++,
      });
    }
  }
}

console.log(`Parsed ${topics.length} topics and ${problems.length} problems.`);

const outputPath = path.join(process.cwd(), 'lib', 'seedData.json');
fs.writeFileSync(outputPath, JSON.stringify({ topics, problems }, null, 2), 'utf-8');
console.log(`Saved to ${outputPath}`);
