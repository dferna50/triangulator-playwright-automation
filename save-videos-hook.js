// Hook to save videos to a persistent directory
import { test as base } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export const test = base.extend({
  page: async ({ page, video }, use) => {
    await use(page);
    
    // Save video after test
    if (video) {
      const videoPath = await page.video().path();
      const videosDir = path.join(process.cwd(), 'videos');
      
      // Create videos directory if it doesn't exist
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }
      
      // Copy video to videos directory with test name
      const testName = test.info().title.replace(/[^a-z0-9]/gi, '_');
      const destPath = path.join(videosDir, `${testName}_${Date.now()}.webm`);
      
      try {
        await page.context().close(); // Ensure video is saved
        fs.copyFileSync(videoPath, destPath);
        console.log(`Video saved to: ${destPath}`);
      } catch (error) {
        console.error('Failed to save video:', error);
      }
    }
  },
});

export { expect } from '@playwright/test';
