import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building,
  GraduationCap,
  Mail,
  User,
  Phone,
  Tag,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RegistrationForm({ initialReferralCode = '', onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    grad_year: '2025',
    whatsapp: '',
    referred_by_code: initialReferralCode,
    acquisition_channel: 'direct',
    utm_source: '',
    utm_medium: '',
    utm_campaign: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Extract URL parameters on mount
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const refParam = searchParams.get('ref') || searchParams.get('referral');
      const channelParam = searchParams.get('channel') || searchParams.get('source');
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');

      setFormData(prev => ({
        ...prev,
        referred_by_code: refParam ? refParam.trim().toUpperCase() : (initialReferralCode || prev.referred_by_code),
        acquisition_channel: channelParam || (refParam ? 'student_ambassador' : prev.acquisition_channel),
        utm_source: utmSource || '',
        utm_medium: utmMedium || '',
        utm_campaign: utmCampaign || ''
      }));
    } catch (e) {}
  }, [initialReferralCode]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'referred_by_code' ? value.toUpperCase() : value
    }));
    if (errors.length > 0) setErrors([]);
    if (duplicateWarning) setDuplicateWarning(null);
  }

  function validateClient() {
    const errs = [];
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.push('Full name must be at least 2 characters');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.push('Please enter a valid email address');
    }
    if (!formData.college.trim() || formData.college.trim().length < 2) {
      errs.push('Please enter your college or institute name');
    }
    if (formData.whatsapp) {
      const cleanPhone = formData.whatsapp.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        errs.push('WhatsApp number should be a valid 10-digit mobile number');
      }
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setDuplicateWarning(null);

    const clientErrors = validateClient();
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await api.registerStudent(formData);
      
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      if (onSuccess) {
        onSuccess(response.registration);
      }
    } catch (err) {
      if (err.status === 409) {
        setDuplicateWarning({
          message: 'You have already registered with this email address!',
          code: err.data?.existingReferralCode
        });
      } else {
        setErrors(err.data?.errors || [err.message || 'Registration could not be completed. Please check your network.']);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 sm:p-7 w-full max-w-md mx-auto transition-all">
      
      {/* Header */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
          <span>● 100% Free Virtual Session</span>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
          Reserve Your Spot
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Build a live AI project step-by-step alongside senior mentors.
        </p>
      </div>

      {/* Duplicate warning notification */}
      {duplicateWarning && (
        <div className="mb-4 p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-xs">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 w-full">
              <p className="font-semibold">{duplicateWarning.message}</p>
              {duplicateWarning.code && (
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-indigo-200 font-mono text-[11px] flex items-center justify-between mt-1">
                  <span>Referral Code: <strong>{duplicateWarning.code}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSuccess) {
                        onSuccess({
                          name: formData.name || 'Student',
                          email: formData.email,
                          college: formData.college || 'Engineering College',
                          referral_code: duplicateWarning.code
                        });
                      }
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-bold underline text-[11px]"
                  >
                    View Hub &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs" role="alert">
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <span>Please complete required fields:</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-red-700 text-[11px]">
            {errors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Registration Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              id="reg-name"
              type="text"
              name="name"
              required
              aria-required="true"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-email">
            College / Personal Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <input
              id="reg-email"
              type="email"
              name="email"
              required
              aria-required="true"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rahul@college.edu"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* College & Grad Year Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-college">
              College Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-college"
                type="text"
                name="college"
                required
                aria-required="true"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. CBIT, VIT, PES..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-grad-year">
              Batch <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <select
                id="reg-grad-year"
                name="grad_year"
                aria-required="true"
                value={formData.grad_year}
                onChange={handleChange}
                className="w-full pl-8 pr-2 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-700"
              >
                <option value="2025">2025 (Final)</option>
                <option value="2026">2026 (Pre-final)</option>
                <option value="2024">2024 (Grad)</option>
                <option value="2027">2027 (2nd Yr)</option>
              </select>
            </div>
          </div>
        </div>

        {/* WhatsApp & Referral Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-whatsapp">
              WhatsApp <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-whatsapp"
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="10-digit number"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="reg-refcode">
              Referral Code <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <input
                id="reg-refcode"
                type="text"
                name="referred_by_code"
                value={formData.referred_by_code}
                onChange={handleChange}
                placeholder="NXT-XXXX"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 uppercase font-mono tracking-wider focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {formData.referred_by_code && (
          <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/50">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
            <span>Referral code active! Peer credit will be awarded upon registration.</span>
          </p>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Securing Your Free Seat...</span>
              </>
            ) : (
              <>
                <span>Confirm Free Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Privacy Reassurance Reassurance */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
          <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span>Privacy assurance: Registration details used solely for workshop access. Zero spam.</span>
        </div>

      </form>

    </div>
  );
}
