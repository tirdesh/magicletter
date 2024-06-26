// src/utils/resumeParser.ts
import { ParsedResume, ResumeSection } from "@/model";
import AIService from "@/services/AIService";
import { aiProviders } from "@/config/aiProviders";
import nlp from 'compromise';

class ResumeParser {
    private text: string;
    private sections: Map<string, string>;

    constructor(text: string) {
        this.text = text;
        this.sections = this.splitIntoSections();
    }

    private splitIntoSections(): Map<string, string> {
        const sectionRegex = /^([A-Z][A-Z\s]+)$/gm;
        const sections = new Map<string, string>();
        let lastSectionTitle = '';
        let lastIndex = 0;

        this.text.replace(sectionRegex, (match, sectionTitle, index) => {
            if (lastSectionTitle) {
                sections.set(lastSectionTitle.trim().toLowerCase(), this.text.slice(lastIndex, index).trim());
            }
            lastSectionTitle = sectionTitle;
            lastIndex = index + match.length;
            return match;
        });

        if (lastSectionTitle) {
            sections.set(lastSectionTitle.trim().toLowerCase(), this.text.slice(lastIndex).trim());
        }

        return sections;
    }

    public async parse(method: 'traditional' | 'nlp' | 'ai', providerName?: 'openai' | 'claude'): Promise<ParsedResume> {
        if (method === 'ai' && providerName) {
            return await this.parseWithAI(providerName);
        } else if (method === 'traditional' || method === 'nlp') {
            return this.parseWithMethod(method);
        } else {
            throw new Error("Unsupported parsing method");
        }
    }

    private parseWithMethod(method: 'traditional' | 'nlp'): ParsedResume {
        return {
            personalInfo: this.extractPersonalInfo(method),
            summary: this.extractSummary(),
            experience: this.extractExperience(),
            education: this.extractEducation(),
            skills: this.extractSkills(),
            projects: this.extractProjects(),
            certifications: this.extractCertifications(),
            languages: this.extractLanguages(),
            additionalSections: this.extractAdditionalSections(),
        };
    }

    private extractPersonalInfo(method: 'traditional' | 'nlp'): ParsedResume['personalInfo'] {
        const personalInfoSection = this.text.split('\n\n')[0];
        
        if (method === 'nlp') {
            return this.extractPersonalInfoNLP(personalInfoSection);
        } else {
            return this.extractPersonalInfoTraditional(personalInfoSection);
        }
    }

    private extractPersonalInfoNLP(text: string): ParsedResume['personalInfo'] {
        const doc = nlp(text);
        return {
            name: doc.people().out('text') || '',
            email: doc.match('#Email').out('text') || '',
            phone: doc.match('#PhoneNumber').out('text') || '',
            location: doc.places().out('text') || '',
        };
    }

    private extractPersonalInfoTraditional(text: string): ParsedResume['personalInfo'] {
        const lines = text.split('\n');
        return {
            name: lines[0] || '',
            email: lines.find(line => line.includes('@')) || '',
            phone: lines.find(line => /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(line)) || '',
            location: lines.find(line => /^[A-Z][a-z]+,\s[A-Z]{2}$/.test(line)) || '',
        };
    }

    private extractSummary(): string {
        return this.sections.get('summary') || '';
    }

    private extractExperience(): ResumeSection[] {
        const experienceSection = this.sections.get('work experience') || '';
        return this.parseSection(experienceSection);
    }

    private extractEducation(): ResumeSection[] {
        const educationSection = this.sections.get('education') || '';
        return this.parseSection(educationSection);
    }

    private extractSkills(): string[] {
        const skillsSection = this.sections.get('technical skills') || '';
        const skills: string[] = [];
        let currentCategory = '';

        skillsSection.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine) {
                if (trimmedLine.endsWith(':')) {
                    currentCategory = trimmedLine.slice(0, -1);
                } else {
                    skills.push(currentCategory ? `${currentCategory}: ${trimmedLine}` : trimmedLine);
                }
            }
        });

        return skills;
    }

    private extractProjects(): ResumeSection[] {
        const projectsSection = this.sections.get('projects') || '';
        const projects = this.parseSection(projectsSection);
        
        return projects.map(project => {
            const [title, details] = project.title.split('|').map(s => s.trim());
            const [link, technologies, date] = details ? details.split('|').map(s => s.trim()) : ['', '', ''];
            return {
                ...project,
                title,
                link,
                technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
                date: this.formatDate(date),
                description: project.content.join(' ').trim(),
            };
        });
    }

    private extractCertifications(): string[] {
        const certificationsSection = this.sections.get('certifications') || '';
        return certificationsSection.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => line.trim());
    }

    private extractLanguages(): string[] {
        const languagesSection = this.sections.get('languages') || '';
        return languagesSection.split('\n')
            .filter(line => line.trim() !== '')
            .map(line => line.trim());
    }

    private extractAdditionalSections(): ResumeSection[] {
        const excludedSections = ['education', 'work experience', 'technical skills', 'projects', 'certifications', 'languages', 'summary'];
        const additionalSections: ResumeSection[] = [];

        for (const [title, content] of this.sections.entries()) {
            if (!excludedSections.includes(title)) {
                additionalSections.push({
                    title,
                    content: content.split('\n').map(line => line.trim()),
                });
            }
        }

        return additionalSections;
    }

    private formatDate(dateString: string): string {
        const months: { [key: string]: string } = {
            'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
            'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12',
            'january': '01', 'february': '02', 'march': '03', 'april': '04', 'june': '06',
            'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12'
        };

        const parts = dateString.toLowerCase().split(/\s*(-|–|to)\s*/);
        const formattedParts = parts.map(part => {
            if (part.toLowerCase() === 'present') {
                return 'Present';
            }
            const [month, year] = part.split(/[\/\s]+/);
            if (months[month]) {
                return `${months[month]}/${year}`;
            } else if (month.length === 2 && year.length === 4) {
                return `${month}/${year}`;
            }
            return '';
        });

        return formattedParts.filter(Boolean).join(' - ');
    }

    private parseSection(sectionContent: string): ResumeSection[] {
        const entries = sectionContent.split(/\n(?=[A-Z])/);
        return entries.map(entry => {
            const lines = entry.split('\n');
            const title = lines[0];
            const content = lines.slice(1).map(line => line.trim());
            const dateMatch = title.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\.?\s+\d{4}\s*(-|–|to)?\s*(Present|\w+\.?\s+\d{4})?\b|\b\d{1,2}\/\d{4}\s*(-|–|to)?\s*(\d{1,2}\/\d{4}|Present)?\b/i);
            const date = dateMatch ? this.formatDate(dateMatch[0]) : '';
            const companyOrInstitution = title.replace(dateMatch ? dateMatch[0] : '', '').split('|')[0].trim();

            return {
                title,
                content,
                date,
                company: companyOrInstitution,
                institution: companyOrInstitution,
            };
        });
    }

    private async parseWithAI(providerName: 'openai' | 'claude'): Promise<ParsedResume> {
        const providerConfig = aiProviders[providerName];
        if (!providerConfig) {
            throw new Error(`Unsupported AI provider: ${providerName}`);
        }

        const aiService = new AIService(providerName);
        const prompt = `Parse the following resume text and return a JSON object with the following structure:
        {
            "personalInfo": { "name": "", "email": "", "phone": "", "location": "" },
            "summary": "",
            "experience": [{ "title": "", "content": [""], "company": "", "date": "" }],
            "education": [{ "title": "", "content": [""], "institution": "", "date": "" }],
            "skills": [""],
            "projects": [{ "title": "", "description": "", "technologies": [""], "date": "" }],
            "certifications": [""],
            "languages": [""],
            "additionalSections": [{ "title": "", "content": [""] }]
        }
        Ensure all dates are in the format 'MM/YYYY - MM/YYYY' or 'MM/YYYY - Present'.
        For skills, projects, certifications, and languages, extract as much information as possible from the resume text.`;
    
        try {
            console.log(`Parsing resume with ${providerName} AI provider...`);
            const result = await aiService.processText(prompt, this.text);
            const parsedResult: ParsedResume = JSON.parse(result);
            return this.formatDatesInParsedResume(parsedResult);
        } catch (error) {
            console.error(`Error parsing resume with ${providerName} AI provider:`, error);
            throw error;
        }
    }

    private formatDatesInParsedResume(parsedResume: ParsedResume): ParsedResume {
        const formatSections = (sections: ResumeSection[]) => 
            sections.map(section => ({
                ...section,
                date: this.formatDate(section.date || '')
            }));

        return {
            ...parsedResume,
            experience: formatSections(parsedResume.experience),
            education: formatSections(parsedResume.education),
            projects: formatSections(parsedResume.projects),
        };
    }
}

async function parseResume(resumeText: string, method: 'traditional' | 'nlp' | 'ai', providerName?: 'openai' | 'claude'): Promise<ParsedResume> {
    console.log(resumeText);
    const parser = new ResumeParser(resumeText);
    try {
        const parsedResume = await parser.parse(method, providerName);
        console.log(`${method.toUpperCase()} Method:`, JSON.stringify(parsedResume, null, 2));
        return parsedResume;
    } catch (error) {
        console.error(`Error parsing resume with ${method} method and ${providerName} provider:`, error);
        throw error;
    }
}

export default parseResume;

