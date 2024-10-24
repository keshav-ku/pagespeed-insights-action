const axios = require('axios');
const core = require('@actions/core');

async function run() {
  try {
    const url = core.getInput('url');
    const apiKey = core.getInput('key');

    // Call PageSpeed Insights API
    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}`
    );

    const lighthouseResult = response.data.lighthouseResult;

    // Extracting relevant metrics
    const score = lighthouseResult.categories.performance.score * 100;
    const lcp = lighthouseResult.audits['largest-contentful-paint'].displayValue;
    const cls = lighthouseResult.audits['cumulative-layout-shift'].displayValue;
    const fcp = lighthouseResult.audits['first-contentful-paint'].displayValue;
    const tbt = lighthouseResult.audits['total-blocking-time'].displayValue;

    // Set outputs for the action
    core.setOutput('score', score);
    core.setOutput('largest-contentful-paint', lcp);
    core.setOutput('cumulative-layout-shift', cls);
    core.setOutput('first-contentful-paint', fcp);
    core.setOutput('total-blocking-time', tbt);

    console.log(`PageSpeed score for ${url}: ${score}`);
    console.log(`LCP: ${lcp}`);
    console.log(`CLS: ${cls}`);
    console.log(`FCP: ${fcp}`);
    console.log(`TBT: ${tbt}`);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
