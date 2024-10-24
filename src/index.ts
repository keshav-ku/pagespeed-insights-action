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

    // Fetch desktop and mobile results
    const desktopResponse = await axios.get<{ lighthouseResult: LighthouseResult }>(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}&strategy=desktop`
    );
    const mobileResponse = await axios.get<{ lighthouseResult: LighthouseResult }>(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}&strategy=mobile`
    );

    console.log('Desktop Response:', desktopResponse.data);
    console.log('Mobile Response:', mobileResponse.data);

    const desktopResult = desktopResponse.data.lighthouseResult;
    const mobileResult = mobileResponse.data.lighthouseResult;

    // Extract relevant metrics for desktop
    const desktopScore = desktopResult.categories.performance?.score !== undefined ? desktopResult.categories.performance.score * 100 : 'N/A';
    const desktopLCP = desktopResult.audits['largest-contentful-paint']?.displayValue || 'N/A';
    const desktopCLS = desktopResult.audits['cumulative-layout-shift']?.displayValue || 'N/A';
    const desktopFCP = desktopResult.audits['first-contentful-paint']?.displayValue || 'N/A';
    const desktopTBT = desktopResult.audits['total-blocking-time']?.displayValue || 'N/A';
    const desktopSpeed = desktopResult.audits['speed-index']?.displayValue || 'N/A';

    // Extract relevant metrics for mobile
    const mobileScore = mobileResult.categories.performance?.score !== undefined ? mobileResult.categories.performance.score * 100 : 'N/A';
    const mobileLCP = mobileResult.audits['largest-contentful-paint']?.displayValue || 'N/A';
    const mobileCLS = mobileResult.audits['cumulative-layout-shift']?.displayValue || 'N/A';
    const mobileFCP = mobileResult.audits['first-contentful-paint']?.displayValue || 'N/A';
    const mobileTBT = mobileResult.audits['total-blocking-time']?.displayValue || 'N/A';
    const mobileSpeed = mobileResult.audits['speed-index']?.displayValue || 'N/A';

    // Log the extracted values
    console.log('Desktop Results:', { desktopScore, desktopLCP, desktopCLS, desktopFCP, desktopTBT, desktopSpeed });
    console.log('Mobile Results:', { mobileScore, mobileLCP, mobileCLS, mobileFCP, mobileTBT, mobileSpeed });

    // Set outputs for desktop
    core.setOutput('desktop_score', desktopScore);
    core.setOutput('desktop_lcp', desktopLCP);
    core.setOutput('desktop_cls', desktopCLS);
    core.setOutput('desktop_fcp', desktopFCP);
    core.setOutput('desktop_tbt', desktopTBT);
    core.setOutput('desktop_speed', desktopSpeed);

    // Set outputs for mobile
    core.setOutput('mobile_score', mobileScore);
    core.setOutput('mobile_lcp', mobileLCP);
    core.setOutput('mobile_cls', mobileCLS);
    core.setOutput('mobile_fcp', mobileFCP);
    core.setOutput('mobile_tbt', mobileTBT);
    core.setOutput('mobile_speed', mobileSpeed);

  } catch (error) {
    core.setFailed(`Action failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

run();
