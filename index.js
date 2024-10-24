const axios = require('axios');
const core = require('@actions/core');

async function run() {
  try {
    const url = core.getInput('url');
    const apiKey = core.getInput('key');

    // PageSpeed Insights API を呼び出す
    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}`
    );

    const lighthouseResult = response.data.lighthouseResult;

    // 関連するメトリクスを抽出
    const score = lighthouseResult.categories.performance.score !== undefined ? lighthouseResult.categories.performance.score * 100 : 'N/A';
    const lcp = lighthouseResult.audits['largest-contentful-paint'].displayValue || 'N/A';
    const cls = lighthouseResult.audits['cumulative-layout-shift'].displayValue || 'N/A';
    const fcp = lighthouseResult.audits['first-contentful-paint'].displayValue || 'N/A';
    const tbt = lighthouseResult.audits['total-blocking-time'].displayValue || 'N/A';
    const speed = lighthouseResult.audits['speed-index'].displayValue || 'N/A';

    // アクションの出力を設定
    core.setOutput('score', score);
    core.setOutput('largest-contentful-paint', lcp);
    core.setOutput('cumulative-layout-shift', cls);
    core.setOutput('first-contentful-paint', fcp);
    core.setOutput('total-blocking-time', tbt);
    core.setOutput('speed-index', speed);

  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
