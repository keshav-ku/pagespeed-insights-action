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

    // Call PageSpeed Insights API
    const desktopResponse = await axios.get<{ lighthouseResult: LighthouseResult }>(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}&strategy=desktop`
    );

    const desktopResult = desktopResponse.data.lighthouseResult;

    // Extracting relevant metrics
    const desktopScore = desktopResult.categories.performance.score !== undefined ? desktopResult.categories.performance.score * 100 : 'N/A';
    const desktopLcp = desktopResult.audits['largest-contentful-paint'].displayValue || 'N/A';
    const desktopCls = desktopResult.audits['cumulative-layout-shift'].displayValue || 'N/A';
    const desktopFcp = desktopResult.audits['first-contentful-paint'].displayValue || 'N/A';
    const desktopTbt = desktopResult.audits['total-blocking-time'].displayValue || 'N/A';
    const desktopSpeed = desktopResult.audits['speed-index'].displayValue || 'N/A';

    // Set outputs for the action
    core.setOutput('desktop-score', desktopScore);
    core.setOutput('desktop-largest-contentful-paint', desktopLcp);
    core.setOutput('desktop-cumulative-layout-shift', desktopCls);
    core.setOutput('desktop-first-contentful-paint', desktopFcp);
    core.setOutput('desktop-total-blocking-time', desktopTbt);
    core.setOutput('desktop-speed-index', desktopSpeed);

  } catch (error) {
    core.setFailed(`Action failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

run();
