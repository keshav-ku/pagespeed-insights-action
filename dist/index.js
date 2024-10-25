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
            const desktopResponse = yield axios_1.default.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${apiKey}&strategy=desktop`);
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
            core.setOutput('largest-contentful-paint', desktopLcp);
            core.setOutput('cumulative-layout-shift', desktopCls);
            core.setOutput('first-contentful-paint', desktopFcp);
            core.setOutput('total-blocking-time', desktopTbt);
            core.setOutput('speed-index', desktopSpeed);
        }
        catch (error) {
            core.setFailed(`Action failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
}
run();
