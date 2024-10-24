import axios from 'axios';
import * as core from '@actions/core';

interface LighthouseResult {
  categories: {
    performance: {
      score: number;
    };
  };
  audits: {
    'largest-contentful-paint': { displayValue: string };
    'cumulative-layout-shift': { displayValue: string };
    'first-contentful-paint': { displayValue: string };
    'total-blocking-time': { displayValue: string };
    'speed-index': { displayValue: string };
  };
}

async function run(): Promise<void> {
  try {
    const url: string = core.getInput('url');
    const apiKey: string = core.getInput('key');

    // Fetch desktop results
    const desktopResponse = await axios.get<{ lighthouseResult: LighthouseResult }>(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}&strategy=desktop`
    );

    // Fetch mobile results
    const mobileResponse = await axios.get<{ lighthouseResult: LighthouseResult }>(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}&strategy=mobile`
    );

    // Extract desktop metrics
    const desktopResult = desktopResponse.data.lighthouseResult;
    const desktopScore = desktopResult.categories.performance.score !== undefined ? desktopResult.categories.performance.score * 100 : 'N/A';
    const desktopLCP = desktopResult.audits['largest-contentful-paint'].displayValue || 'N/A';
    const desktopCLS = desktopResult.audits['cumulative-layout-shift'].displayValue || 'N/A';
    const desktopFCP = desktopResult.audits['first-contentful-paint'].displayValue || 'N/A';
    const desktopTBT = desktopResult.audits['total-blocking-time'].displayValue || 'N/A';
    const desktopSpeed = desktopResult.audits['speed-index'].displayValue || 'N/A';

    // Extract mobile metrics
    const mobileResult = mobileResponse.data.lighthouseResult;
    const mobileScore = mobileResult.categories.performance.score !== undefined ? mobileResult.categories.performance.score * 100 : 'N/A';
    const mobileLCP = mobileResult.audits['largest-contentful-paint'].displayValue || 'N/A';
    const mobileCLS = mobileResult.audits['cumulative-layout-shift'].displayValue || 'N/A';
    const mobileFCP = mobileResult.audits['first-contentful-paint'].displayValue || 'N/A';
    const mobileTBT = mobileResult.audits['total-blocking-time'].displayValue || 'N/A';
    const mobileSpeed = mobileResult.audits['speed-index'].displayValue || 'N/A';

    // Set outputs for desktop
    core.setOutput('desktop_score', desktopScore);
    core.setOutput('desktop_largest-contentful-paint', desktopLCP);
    core.setOutput('desktop_cumulative-layout-shift', desktopCLS);
    core.setOutput('desktop_first-contentful-paint', desktopFCP);
    core.setOutput('desktop_total-blocking-time', desktopTBT);
    core.setOutput('desktop_speed-index', desktopSpeed);

    // Set outputs for mobile
    core.setOutput('mobile_score', mobileScore);
    core.setOutput('mobile_largest-contentful-paint', mobileLCP);
    core.setOutput('mobile_cumulative-layout-shift', mobileCLS);
    core.setOutput('mobile_first-contentful-paint', mobileFCP);
    core.setOutput('mobile_total-blocking-time', mobileTBT);
    core.setOutput('mobile_speed-index', mobileSpeed);

  } catch (error) {
    core.setFailed(`Action failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

run();
