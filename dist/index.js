"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const core = __importStar(require("@actions/core"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = core.getInput('url');
            const apiKey = core.getInput('key');
            // Call PageSpeed Insights API
            const response = yield axios_1.default.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}`);
            const lighthouseResult = response.data.lighthouseResult;
            // Extracting relevant metrics
            const score = lighthouseResult.categories.performance.score !== undefined ? lighthouseResult.categories.performance.score * 100 : 'N/A';
            const lcp = lighthouseResult.audits['largest-contentful-paint'].displayValue || 'N/A';
            const cls = lighthouseResult.audits['cumulative-layout-shift'].displayValue || 'N/A';
            const fcp = lighthouseResult.audits['first-contentful-paint'].displayValue || 'N/A';
            const tbt = lighthouseResult.audits['total-blocking-time'].displayValue || 'N/A';
            const speed = lighthouseResult.audits['speed-index'].displayValue || 'N/A';
            // Set outputs for the action
            core.setOutput('score', score);
            core.setOutput('largest-contentful-paint', lcp);
            core.setOutput('cumulative-layout-shift', cls);
            core.setOutput('first-contentful-paint', fcp);
            core.setOutput('total-blocking-time', tbt);
            core.setOutput('speed-index', speed);
        }
        catch (error) {
            core.setFailed(`Action failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
}
run();
