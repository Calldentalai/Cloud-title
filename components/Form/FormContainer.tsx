'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, Copy, CheckCircle, Mail } from 'lucide-react';
import { FormData, FileData, initialFormData, formSteps, StepConfig, ADMIN_EMAIL } from '@/lib/types';
import FormProgress from './FormProgress';
import FormCard from './FormCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import FileDropzone from '@/components/ui/FileDropzone';
import MultiFileDropzone from '@/components/ui/MultiFileDropzone';
import ColorPicker from '@/components/ui/ColorPicker';

export default function FormContainer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const step = formSteps[currentStep];

  const updateField = useCallback((field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(ADMIN_EMAIL);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const canProceed = useCallback(() => {
    if (!step.required) return true;
    if (!step.field) return true;

    const value = formData[step.field];
    if (step.type === 'file') {
      return value !== null;
    }
    if (step.type === 'multifile') {
      return true;
    }
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return true;
  }, [step, formData]);

  const goNext = useCallback(() => {
    // Skip OpenAI API key step if user needs help
    if (step.id === 'needsOpenaiHelp' && formData.needsOpenaiHelp) {
      setDirection(1);
      setCurrentStep((prev) => prev + 2);
      return;
    }

    if (currentStep < formSteps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, step.id, formData.needsOpenaiHelp]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      if (formSteps[currentStep - 1].id === 'openaiApiKey' && formData.needsOpenaiHelp) {
        setCurrentStep((prev) => prev - 2);
      } else {
        setCurrentStep((prev) => prev - 1);
      }
    }
  }, [currentStep, formData.needsOpenaiHelp]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canProceed()) {
      e.preventDefault();
      goNext();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        submissionId: `CT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        clientInfo: {
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
        },
        platformAccess: {
          titleCapture: formData.titleCaptureAccess,
          ghl: formData.ghlAccess,
          wordpress: formData.wordpressAccess,
          wordpressUrl: formData.wordpressUrl,
        },
        openai: {
          apiKey: formData.openaiApiKey,
          needsHelp: formData.needsOpenaiHelp,
        },
        branding: {
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          logo: formData.logo,
        },
        documents: {
          samplePdf: formData.samplePdf,
          additional: formData.additionalDocs,
        },
        other: {
          calendlyLink: formData.calendlyLink,
          notes: formData.notes,
        },
      };

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true);
        goNext();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step.type) {
      case 'welcome':
        return (
          <div className="text-center space-y-4 md:space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{step.question}</h1>
            <p className="text-base md:text-lg text-gray-600">{step.description}</p>
            <Button onClick={goNext} className="mt-6 md:mt-8 w-full md:w-auto">
              Let&apos;s get started <ArrowRight size={20} />
            </Button>
          </div>
        );

      case 'instruction':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.question}</h2>
              {step.description && <p className="text-gray-600 text-sm md:text-base">{step.description}</p>}
            </div>

            {/* Email to add */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-700">Add this email:</span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <code className="flex-1 bg-white px-4 py-3 rounded-lg border text-blue-600 font-mono text-sm md:text-base break-all">
                  {step.email}
                </code>
                <Button
                  variant="outline"
                  onClick={copyEmail}
                  className="shrink-0 !px-4 !py-3"
                >
                  {emailCopied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                  {emailCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            {/* Platforms list */}
            {step.platforms && (
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Platforms to add us to:</p>
                <ul className="space-y-2">
                  {step.platforms.map((platform, index) => (
                    <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 md:p-4 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 text-sm md:text-base">{platform}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'text':
      case 'email':
      case 'phone':
      case 'password':
      case 'url':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.question}</h2>
              {step.description && <p className="text-gray-600 text-sm md:text-base">{step.description}</p>}
            </div>
            <Input
              type={step.type === 'phone' ? 'tel' : step.type}
              value={(formData[step.field!] as string) || ''}
              onChange={(value) => updateField(step.field!, value)}
              onKeyDown={handleKeyDown}
              placeholder={step.placeholder}
              autoFocus
            />
            {step.helperText && (
              <p className="text-sm text-gray-500">{step.helperText}</p>
            )}
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.question}</h2>
              {step.description && <p className="text-gray-600 text-sm md:text-base">{step.description}</p>}
            </div>
            <div className="grid gap-3 md:gap-4">
              {step.choices?.map((choice) => (
                <button
                  key={choice.label}
                  type="button"
                  onClick={() => {
                    updateField(step.field!, choice.value);
                    setTimeout(goNext, 200);
                  }}
                  className={`w-full p-4 md:p-6 text-left border-2 rounded-xl transition-all ${
                    formData[step.field!] === choice.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base md:text-lg font-medium">{choice.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'color':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.question}</h2>
              {step.description && <p className="text-gray-600 text-sm md:text-base">{step.description}</p>}
            </div>
            <div className="space-y-4 md:space-y-6">
              <ColorPicker
                label="Primary Color"
                value={formData.primaryColor}
                onChange={(value) => updateField('primaryColor', value)}
              />
              <ColorPicker
                label="Secondary Color"
                value={formData.secondaryColor}
                onChange={(value) => updateField('secondaryColor', value)}
              />
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.question}</h2>
              {step.description && <p className="text-gray-600 text-sm md:text-base">{step.description}</p>}
            </div>
            <FileDropzone
              onFileSelect={(file) => updateField(step.field!, file)}
              accept={step.accept}
              currentFile={formData[step.field!] as FileData | null}
              onRemove={() => updateField(step.field!, null)}
            />
          </div>
        );

      case 'multifile':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.question}</h2>
              {step.description && <p className="text-gray-600 text-sm md:text-base">{step.description}</p>}
            </div>
            <MultiFileDropzone
              onFilesSelect={(files) => updateField(step.field!, files)}
              accept={step.accept}
              currentFiles={formData[step.field!] as FileData[]}
              onRemove={(index) => {
                const files = [...(formData[step.field!] as FileData[])];
                files.splice(index, 1);
                updateField(step.field!, files);
              }}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.question}</h2>
              {step.description && <p className="text-gray-600 text-sm md:text-base">{step.description}</p>}
            </div>
            <TextArea
              value={(formData[step.field!] as string) || ''}
              onChange={(value) => updateField(step.field!, value)}
              placeholder={step.placeholder}
              rows={5}
            />
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.question}</h2>
              {step.description && <p className="text-gray-600 text-sm md:text-base">{step.description}</p>}
            </div>
            <div className="space-y-3 md:space-y-4 max-h-80 md:max-h-96 overflow-y-auto">
              <ReviewSection title="Client Information">
                <ReviewItem label="Company" value={formData.companyName} />
                <ReviewItem label="Contact" value={formData.contactPerson} />
                <ReviewItem label="Email" value={formData.email} />
                <ReviewItem label="Phone" value={formData.phone} />
              </ReviewSection>
              <ReviewSection title="Platform Access">
                <ReviewItem label="Title Capture" value={formData.titleCaptureAccess ? '✓ Added' : '⏳ Pending'} />
                <ReviewItem label="GoHighLevel" value={formData.ghlAccess ? '✓ Added' : '⏳ Pending'} />
                <ReviewItem label="WordPress" value={formData.wordpressAccess ? '✓ Added' : '⏳ Pending'} />
                <ReviewItem label="WordPress URL" value={formData.wordpressUrl || '—'} />
              </ReviewSection>
              <ReviewSection title="OpenAI">
                <ReviewItem label="Status" value={formData.needsOpenaiHelp ? 'Needs help setting up' : (formData.openaiApiKey ? '✓ Provided' : '—')} />
              </ReviewSection>
              <ReviewSection title="Branding">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Colors:</span>
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded border" style={{ backgroundColor: formData.primaryColor }} />
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded border" style={{ backgroundColor: formData.secondaryColor }} />
                </div>
                <ReviewItem label="Logo" value={formData.logo?.filename || '— Not uploaded'} />
              </ReviewSection>
              <ReviewSection title="Documents">
                <ReviewItem label="Sample PDF" value={formData.samplePdf?.filename || '✗ Not uploaded'} />
                <ReviewItem label="Additional" value={`${formData.additionalDocs.length} file(s)`} />
              </ReviewSection>
              {(formData.calendlyLink || formData.notes) && (
                <ReviewSection title="Other">
                  {formData.calendlyLink && <ReviewItem label="Calendly" value={formData.calendlyLink} />}
                  {formData.notes && <ReviewItem label="Notes" value={formData.notes.substring(0, 50) + (formData.notes.length > 50 ? '...' : '')} />}
                </ReviewSection>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Submitting...
                </>
              ) : (
                <>
                  Submit <Check size={20} />
                </>
              )}
            </Button>
          </div>
        );

      case 'thankyou':
        return (
          <div className="text-center space-y-4 md:space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{step.question}</h1>
            <p className="text-base md:text-lg text-gray-600">{step.description}</p>
            <div className="pt-4">
              <p className="text-gray-500 text-sm md:text-base">
                We&apos;ll be in touch within 24 hours to kick off your project.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const showNavigation = step.type !== 'welcome' && step.type !== 'thankyou' && step.type !== 'review';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 md:py-8 px-3 md:px-4">
      <div className="max-w-4xl mx-auto">
        {step.type !== 'welcome' && step.type !== 'thankyou' && (
          <div className="mb-4 md:mb-8">
            <FormProgress currentStep={currentStep} totalSteps={formSteps.length} />
          </div>
        )}

        <FormCard stepKey={step.id} direction={direction}>
          {renderStepContent()}

          {showNavigation && (
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
              <Button variant="outline" onClick={goBack} disabled={currentStep === 0} className="w-full sm:w-auto">
                <ArrowLeft size={20} /> Back
              </Button>
              <Button onClick={goNext} disabled={!canProceed()} className="w-full sm:w-auto">
                {step.required === false && !formData[step.field as keyof FormData] ? 'Skip' : 'Continue'} <ArrowRight size={20} />
              </Button>
            </div>
          )}
        </FormCard>

        <div className="text-center mt-6 md:mt-8 text-gray-500 text-xs md:text-sm">
          <p>Powered by AI Growth Advisor</p>
        </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 md:p-4">
      <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs md:text-sm gap-2">
      <span className="text-gray-600 shrink-0">{label}:</span>
      <span className="text-gray-800 font-medium text-right break-all">{value}</span>
    </div>
  );
}
