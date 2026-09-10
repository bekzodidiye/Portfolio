/**
 * AI Knowledge Base & Natural Response Engine for Bekzod Idiyev's Portfolio
 * Supports Uzbek, Russian, and English responses with rich technical context.
 */

import { CandidateProfile, ProjectItem, SkillCategory, WorkExperienceItem, EducationItem } from '../types/portfolio';
import {
  getInitialAiGreeting,
  getQuickSuggestionChips,
  buildContactAnswer,
  buildProjectsAnswer,
  buildTechStackAnswer,
  buildBotAnswer,
  buildExperienceAnswer,
  buildFallbackAnswer,
} from './aiKnowledgeHelpers';

export { getInitialAiGreeting, getQuickSuggestionChips };

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  chips?: string[];
  isLeadForm?: boolean;
}

export interface AIContextData {
  candidateProfile: CandidateProfile;
  projects: ProjectItem[];
  skills: SkillCategory[];
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  language: 'uz' | 'ru' | 'en';
}

export const generateAiResponse = async (
  prompt: string,
  ctx: AIContextData
): Promise<string> => {
  const p = prompt.toLowerCase().trim();
  const { candidateProfile, projects, language } = ctx;

  // 1. Contact / Hiring Intent
  if (
    p.includes('kontakt') ||
    p.includes('aloqa') ||
    p.includes('bog\'lan') ||
    p.includes('telefon') ||
    p.includes('email') ||
    p.includes('telegram') ||
    p.includes('contact') ||
    p.includes('hire') ||
    p.includes('связаться') ||
    p.includes('контакт') ||
    p.includes('нанять') ||
    p.includes('почта')
  ) {
    return buildContactAnswer(candidateProfile, language);
  }

  // 2. Projects Intent
  if (
    p.includes('loyiha') ||
    p.includes('proyekt') ||
    p.includes('project') ||
    p.includes('portfoli') ||
    p.includes('проект') ||
    p.includes('ishlar') ||
    p.includes('qilgan')
  ) {
    return buildProjectsAnswer(projects, language);
  }

  // 3. Backend & Tech Stack Intent
  if (
    p.includes('backend') ||
    p.includes('fastapi') ||
    p.includes('django') ||
    p.includes('python') ||
    p.includes('postgre') ||
    p.includes('redis') ||
    p.includes('docker') ||
    p.includes('stek') ||
    p.includes('stack') ||
    p.includes('texnolog') ||
    p.includes('опыт') ||
    p.includes('технолог') ||
    p.includes('навык') ||
    p.includes('skill')
  ) {
    return buildTechStackAnswer(language);
  }

  // 4. Telegram Bot Intent
  if (
    p.includes('bot') ||
    p.includes('telegram') ||
    p.includes('aiogram') ||
    p.includes('mini app') ||
    p.includes('боты') ||
    p.includes('телеграм')
  ) {
    return buildBotAnswer(language);
  }

  // 5. Work Experience & Freelance Intent
  if (
    p.includes('tajriba') ||
    p.includes('ish') ||
    p.includes('kwork') ||
    p.includes('freelance') ||
    p.includes('kompaniya') ||
    p.includes('опыт работы') ||
    p.includes('фриланс') ||
    p.includes('experience')
  ) {
    return buildExperienceAnswer(candidateProfile, language);
  }

  // 6. Default Fallback Answer
  return buildFallbackAnswer(candidateProfile, language);
};
