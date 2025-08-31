'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Home, 
  User, 
  Building, 
  Eye,
  EyeOff,
  Check,
  X,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Shield
} from 'lucide-react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  address?: string
  city?: string
  province?: string
  postalCode?: string
  // Renter specific
  occupation?: string
  monthlyIncome?: string
  references?: string
  // Landlord specific
  companyName?: string
  businessNumber?: string
  propertyCount?: string
  experience?: string
}

interface FormErrors {
  [key: string]: string
}

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<'renter' | 'landlord'>('renter')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    occupation: '',
    monthlyIncome: '',
    references: '',
    companyName: '',
    businessNumber: '',
    propertyCount: '',
    experience: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  }

  const validatePostalCode = (postalCode: string) => {
    const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/
    return canadianPostalRegex.test(postalCode)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!Object.values(passwordValidation).every(Boolean)) {
        newErrors.password = 'Password does not meet requirements'
      }
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.address?.trim()) newErrors.address = 'Address is required'
    if (!formData.city?.trim()) newErrors.city = 'City is required'
    if (!formData.province?.trim()) newErrors.province = 'Province is required'
    if (!formData.postalCode?.trim()) {
      newErrors.postalCode = 'Postal code is required'
    } else if (!validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid Canadian postal code'
    }

    // Tab-specific validation
    if (activeTab === 'renter') {
      if (!formData.occupation?.trim()) newErrors.occupation = 'Occupation is required'
      if (!formData.monthlyIncome?.trim()) newErrors.monthlyIncome = 'Monthly income is required'
    } else {
      if (!formData.companyName?.trim()) newErrors.companyName = 'Company name is required'
      if (!formData.propertyCount?.trim()) newErrors.propertyCount = 'Property count is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Here you would normally send data to your backend
    console.log('Form submitted:', { ...formData, userType: activeTab })
    
    setIsSubmitting(false)
    // Redirect or show success message
  }

  const passwordValidation = validatePassword(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">RentConnect</span>
              <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full">CA</span>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join RentConnect</h1>
            <p className="text-xl text-gray-600">Create your account and start connecting today</p>
          </div>

          <Card className="shadow-2xl">
            <CardHeader className="pb-2">
              {/* Tab Switcher */}
              <div className="relative">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('renter')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                      activeTab === 'renter'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Register as Renter</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('landlord')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                      activeTab === 'landlord'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Building className="h-5 w-5" />
                    <span>Register as Landlord</span>
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={errors.firstName ? 'border-red-500' : ''}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={errors.lastName ? 'border-red-500' : ''}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Security
                  </h3>
                  
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    
                    {formData.password && (
                      <div className="mt-2 space-y-1">
                        <div className="text-sm text-gray-600">Password requirements:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`flex items-center space-x-1 ${passwordValidation.length ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordValidation.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>8+ characters</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordValidation.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>Uppercase letter</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordValidation.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>Lowercase letter</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${passwordValidation.number ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordValidation.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>Number</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${passwordValidation.special ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordValidation.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            <span>Special character</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address Information
                  </h3>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'border-red-500' : ''}
                      placeholder="123 Main Street"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={errors.city ? 'border-red-500' : ''}
                        placeholder="Toronto"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="province">Province *</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        className={errors.province ? 'border-red-500' : ''}
                        placeholder="ON"
                      />
                      {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value.toUpperCase())}
                        className={errors.postalCode ? 'border-red-500' : ''}
                        placeholder="M5V 3A8"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                  </div>
                </div>

                {/* Tab-specific fields */}
                <div className={`space-y-4 transition-all duration-300 ${activeTab === 'renter' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  {activeTab === 'renter' && (
                    <>
                      <h3 className="text-lg font-semibold text-blue-600 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Renter Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="occupation">Occupation *</Label>
                          <Input
                            id="occupation"
                            value={formData.occupation}
                            onChange={(e) => handleInputChange('occupation', e.target.value)}
                            className={errors.occupation ? 'border-red-500' : ''}
                            placeholder="Software Developer"
                          />
                          {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
                        </div>

                        <div>
                          <Label htmlFor="monthlyIncome">Monthly Income (CAD) *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">$</span>
                            <Input
                              id="monthlyIncome"
                              type="number"
                              value={formData.monthlyIncome}
                              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                              className={`pl-8 ${errors.monthlyIncome ? 'border-red-500' : ''}`}
                              placeholder="5000"
                            />
                          </div>
                          {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="references">References (Optional)</Label>
                        <Input
                          id="references"
                          value={formData.references}
                          onChange={(e) => handleInputChange('references', e.target.value)}
                          placeholder="Previous landlord contact information"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className={`space-y-4 transition-all duration-300 ${activeTab === 'landlord' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  {activeTab === 'landlord' && (
                    <>
                      <h3 className="text-lg font-semibold text-green-600 flex items-center">
                        <Building className="h-5 w-5 mr-2" />
                        Landlord Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company/Business Name *</Label>
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            className={errors.companyName ? 'border-red-500' : ''}
                            placeholder="ABC Property Management"
                          />
                          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                        </div>

                        <div>
                          <Label htmlFor="businessNumber">Business Number (Optional)</Label>
                          <Input
                            id="businessNumber"
                            value={formData.businessNumber}
                            onChange={(e) => handleInputChange('businessNumber', e.target.value)}
                            placeholder="123456789"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="propertyCount">Number of Properties *</Label>
                          <Input
                            id="propertyCount"
                            type="number"
                            value={formData.propertyCount}
                            onChange={(e) => handleInputChange('propertyCount', e.target.value)}
                            className={errors.propertyCount ? 'border-red-500' : ''}
                            placeholder="5"
                          />
                          {errors.propertyCount && <p className="text-red-500 text-sm mt-1">{errors.propertyCount}</p>}
                        </div>

                        <div>
                          <Label htmlFor="experience">Years of Experience (Optional)</Label>
                          <Input
                            id="experience"
                            type="number"
                            value={formData.experience}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
                            placeholder="10"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Terms and Submit */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-1">Your data is secure</p>
                        <p>We use industry-standard encryption to protect your personal information. By registering, you agree to our Terms of Service and Privacy Policy.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full py-3 text-lg font-medium ${
                      activeTab === 'renter' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      `Create ${activeTab === 'renter' ? 'Renter' : 'Landlord'} Account`
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}