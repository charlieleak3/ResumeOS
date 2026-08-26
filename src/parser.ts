import { ResumeBlock } from './types';

export class DocumentParser {
  public static async parseFile(file: File): Promise<ResumeBlock[]> {
    const text = await file.text();
    const fileName = file.name.replace(/\.[^/.]+$/, "");

    // Extract auto-suggested tech/skill tags via basic keyword detection
    const extractedTags = this.extractTags(text);

    const parsedBlock: ResumeBlock = {
      id: `imported_${Date.now()}`,
      title: `Imported Role: ${fileName}`,
      content: text.trim() || 'No previewable text found in imported file.',
      tags: extractedTags.length > 0 ? extractedTags : ['#imported', '#parsed']
    };

    return [parsedBlock];
  }

  private static extractTags(text: string): string[] {
    const commonSkills = ['react', 'node', 'python', 'cloud', 'typescript', 'aws', 'lead', 'design', 'management', 'sql'];
    const foundTags: string[] = [];
    const lowerText = text.toLowerCase();

    commonSkills.forEach(skill => {
      if (lowerText.includes(skill)) {
        foundTags.push(`#${skill}`);
      }
    });

    return foundTags;
  }
}