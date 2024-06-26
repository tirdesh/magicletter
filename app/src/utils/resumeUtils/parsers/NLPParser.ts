// src/utils/parsers/NLPParser.ts
import { BaseParser } from './BaseParser';
import { ParsedResume, ResumeSection } from "@/model";
import nlp from 'compromise';

export class NLPParser extends BaseParser {
    async parse(): Promise<ParsedResume> {
        return {
            personalInfo: this.extractPersonalInfo(),
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

    private extractPersonalInfo(): ParsedResume['personalInfo'] {
        const doc = nlp(this.text.split('\n\n')[0]);
        return {
            name: doc.people().out('text') || '',
            email: doc.match('#Email').out('text') || '',
            phone: doc.match('#PhoneNumber').out('text') || '',
            location: doc.places().out('text') || '',
        };
    }

    private extractSummary(): string {
        return this.sections.get('summary') || '';
    }

    private extractExperience(): ResumeSection[] {
        return this.parseSection(this.sections.get('work experience') || '');
    }

    private extractEducation(): ResumeSection[] {
        return this.parseSection(this.sections.get('education') || '');
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
}