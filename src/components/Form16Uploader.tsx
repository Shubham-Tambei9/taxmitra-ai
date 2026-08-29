import React, { useState } from 'react';
import { Form16Data } from '../types';
import { parseForm16File, SAMPLE_FORM16_PRESETS } from '../lib/form16Extractor';
import { formatINR } from '../lib/taxEngine';
import { UploadCloud, FileText, CheckCircle2, Sparkles, User, Building2, ArrowRight, Shield, AlertCircle, Edit2 } from 'lucide-react';

interface Form16UploaderProps {
  onForm16Loaded: (data: Form16Data) => void;
}

export const Form16Uploader: React.FC<Form16UploaderProps> = ({ onForm16Loaded }) => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<Form16Data | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsExtracting(true);
    try {
      const data = await parseForm16File(file);
      setExtractedData(data);
    } catch (err) {
      console.error('Extraction error', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSampleSelect = (sampleKey: string) => {
    setIsExtracting(true);
    setTimeout(() => {
      setExtractedData(SAMPLE_FORM16_PRESETS[sampleKey].data);
      setIsExtracting(false);
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal AI Form 16 Parser</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          File Income Tax in <span className="text-emerald-400">Plain English</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Upload your Form 16 PDF or try a preset profile. Mitra AI will automatically extract your salary, TDS, and deductions, then guide you through 5 simple questions.
        </p>
      </div>

      {!extractedData ? (
        <div className="space-y-6">
          {/* Main Drag-and-Drop Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            {isExtracting ? (
              <div className="py-8 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-white">Extracting Tax Data with Multimodal AI...</p>
                  <p className="text-xs text-slate-400">Reading Gross Salary, Employer TAN, TDS & Chapter VI-A deductions</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <label className="cursor-pointer">
                    <span className="text-emerald-400 font-bold text-lg hover:underline">
                      Upload Form 16 PDF
                    </span>
                    <span className="text-slate-300 font-medium text-lg"> or drag and drop</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <p className="text-xs text-slate-400 mt-1">Supports PDF Part B or Form 16 images (Max 10MB)</p>
                </div>
                <div className="flex justify-center items-center space-x-2 text-slate-400 text-xs pt-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>100% Secure & Local Processing. No tax data saved on public servers.</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preset Sample Profiles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Or try instant sample profiles (No file required)
              </span>
              <span className="text-xs text-emerald-400">One-click testing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(SAMPLE_FORM16_PRESETS).map(([key, sample]) => (
                <button
                  key={key}
                  onClick={() => handleSampleSelect(key)}
                  className="bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 p-4 rounded-xl text-left transition group space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                        {sample.label}
                      </span>
                    </div>
                    <FileText className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>
                  <p className="text-xs text-slate-400">{sample.role}</p>
                  <div className="text-xs text-slate-300 font-mono bg-slate-900/60 px-2 py-1 rounded">
                    Gross: {formatINR(sample.data.grossSalary)} | TDS: {formatINR(sample.data.tdsDeducted)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Extracted Data Review Card */
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-xl animate-scaleUp">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Form 16 Extracted Successfully</h3>
                <p className="text-xs text-slate-400">
                  {extractedData.fileName || 'Parsed Form 16 PDF'} ({extractedData.financialYear})
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
            >
              <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEditing ? 'Done Editing' : 'Edit Extracted Values'}</span>
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Employee Name & PAN</span>
                </span>
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={extractedData.employeeName}
                    onChange={(e) => setExtractedData({ ...extractedData, employeeName: e.target.value })}
                    className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                  />
                  <input
                    type="text"
                    value={extractedData.employeePan}
                    onChange={(e) => setExtractedData({ ...extractedData, employeePan: e.target.value })}
                    className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                  />
                </div>
              ) : (
                <div className="font-semibold text-white text-sm">
                  {extractedData.employeeName} <span className="text-slate-400 font-mono text-xs">({extractedData.employeePan})</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Employer & TAN</span>
                </span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={extractedData.employerName}
                  onChange={(e) => setExtractedData({ ...extractedData, employerName: e.target.value })}
                  className="w-full bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                />
              ) : (
                <div className="font-semibold text-white text-sm truncate">
                  {extractedData.employerName} <span className="text-slate-400 font-mono text-xs">({extractedData.employerTan})</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Gross Salary u/s 17(1)</span>
              {isEditing ? (
                <input
                  type="number"
                  value={extractedData.grossSalary}
                  onChange={(e) => setExtractedData({ ...extractedData, grossSalary: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-white font-mono text-sm px-2 py-1 rounded border border-slate-700"
                />
              ) : (
                <div className="text-xl font-extrabold text-emerald-400 font-mono">
                  {formatINR(extractedData.grossSalary)}
                </div>
              )}
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">TDS Deducted by Employer</span>
              {isEditing ? (
                <input
                  type="number"
                  value={extractedData.tdsDeducted}
                  onChange={(e) => setExtractedData({ ...extractedData, tdsDeducted: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-white font-mono text-sm px-2 py-1 rounded border border-slate-700"
                />
              ) : (
                <div className="text-xl font-extrabold text-teal-300 font-mono">
                  {formatINR(extractedData.tdsDeducted)}
                </div>
              )}
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setExtractedData(null)}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              Choose different file
            </button>

            <button
              onClick={() => onForm16Loaded(extractedData)}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-6 py-3 rounded-xl font-extrabold shadow-lg hover:from-emerald-400 hover:to-teal-400 transition"
            >
              <span>Start AI Q&A (5 Questions)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
