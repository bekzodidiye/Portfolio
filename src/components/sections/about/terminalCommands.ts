export interface TerminalContext {
  candidateProfile: {
    name: string;
    primaryTitle: string;
    subTitle: string;
    location: string;
    botUsername?: string;
    botUrl?: string;
    telegramHandle?: string;
    email?: string;
    phone?: string;
    freelanceCount?: number;
  };
  language: string;
  openAdmin: () => void;
}

export function generateCandidateSpec(profile: TerminalContext['candidateProfile'], lang: string): string {
  return `"""
bekzod_engineer_spec.py
=============================================================================
Candidate: ${profile.name}
Role: ${profile.primaryTitle}
Education: ${profile.subTitle}
Location: ${profile.location}
Status: AVAILABLE_FOR_HIRE = True
Language: ${lang.toUpperCase()}
=============================================================================
"""

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class BackendEngineer:
    name: str = "${profile.name}"
    title: str = "${profile.primaryTitle}"
    education: str = "${profile.subTitle}"
    base_location: str = "${profile.location}"
    telegram_bot: str = "${profile.botUsername || '@my_portfolio_support_bot'}"
    kwork_deliveries: int = ${profile.freelanceCount || 10}

    def execute_mission(self) -> str:
        return "Designing zero-downtime APIs & scalable Telegram engines."`;
}

export function executeTerminalCommand(
  rawCommand: string,
  context: TerminalContext
): { output?: string; clear?: boolean } {
  const trimmed = rawCommand.trim().toLowerCase();
  if (!trimmed) return {};

  if (trimmed === 'clear') {
    return { clear: true };
  }

  const { candidateProfile, language, openAdmin } = context;

  switch (trimmed) {
    case 'help':
      return {
        output:
          language === 'uz'
            ? 'Mavjud buyruqlar: cat spec, whoami, skills, projects, bot, contact, clear, python --version'
            : language === 'ru'
            ? 'Доступные команды: cat spec, whoami, skills, projects, bot, contact, clear, python --version'
            : 'Available commands: cat spec, whoami, skills, projects, bot, contact, clear, python --version',
      };
    case 'admin':
    case 'sudo':
    case 'sudo su':
    case 'root':
      openAdmin();
      return { output: '👑 Launching Admin Control Center... (PIN authentication required)' };
    case 'whoami':
      return { output: `${candidateProfile.name} — ${candidateProfile.primaryTitle}` };
    case 'skills':
      return { output: 'FastAPI, Django, PostgreSQL, Redis, Docker, aiogram 3.x, WebSockets, Clean Architecture' };
    case 'projects':
      return { output: '1. Portfolio Assistant Bot | 2. Buddy Team (AI Match) | 3. Esports Tournament Bot | 4. PeerLearn Mini App' };
    case 'bot':
    case 'telegram-bot':
      return {
        output: `🤖 Official Interactive Telegram Assistant: ${
          candidateProfile.botUsername || '@my_portfolio_support_bot'
        } (${candidateProfile.botUrl || 'https://t.me/my_portfolio_support_bot'})`,
      };
    case 'contact':
      return {
        output: `Bot: ${candidateProfile.botUsername} | Telegram: ${candidateProfile.telegramHandle} | Email: ${candidateProfile.email} | Phone: ${candidateProfile.phone}`,
      };
    case 'python --version':
      return { output: 'Python 3.12.3 (CPython Linux x86_64, High-Performance AsyncIO)' };
    case 'stats':
    case 'visitors':
    case 'analytics':
      return {
        output: `📊 PORTFOLIO LIVE TELEMETRY: 24/7 Serverless Visitor Gateway Active | Real-time Visitor Telemetry connected to Telegram Bot (${
          candidateProfile.botUsername || '@my_portfolio_support_bot'
        }).`,
      };
    default:
      return { output: `bash: command not found: ${trimmed}. Type 'help' for available commands.` };
  }
}
