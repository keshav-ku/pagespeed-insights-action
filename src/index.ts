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

    const lighthouseResult1 = desktopResponse.data.lighthouseResult;

    // Extracting relevant metrics
    const score = lighthouseResult1.categories.performance.score !== undefined ? lighthouseResult1.categories.performance.score * 100 : 'N/A';
    const lcp = lighthouseResult1.audits['largest-contentful-paint'].displayValue || 'N/A';
    const cls = lighthouseResult1.audits['cumulative-layout-shift'].displayValue || 'N/A';
    const fcp = lighthouseResult1.audits['first-contentful-paint'].displayValue || 'N/A';
    const tbt = lighthouseResult1.audits['total-blocking-time'].displayValue || 'N/A';
    const speed = lighthouseResult1.audits['speed-index'].displayValue || 'N/A';

    // Set outputs for the action
    core.setOutput('score', score);
    core.setOutput('largest-contentful-paint', lcp);
    core.setOutput('cumulative-layout-shift', cls);
    core.setOutput('first-contentful-paint', fcp);
    core.setOutput('total-blocking-time', tbt);
    core.setOutput('speed-index', speed);

  } catch (error) {
    core.setFailed(`Action failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

run();
