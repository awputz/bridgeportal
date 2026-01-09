import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  User, Building2, Share2, Palette, Save, Loader2,
  Instagram, Facebook, Linkedin, Twitter, Globe, Phone, Mail
} from "lucide-react";
import { useBrandProfile, useUpsertBrandProfile, BrandProfileInput } from "@/hooks/marketing/useBrandProfile";
import { useMarketingAssets } from "@/hooks/marketing/useMarketingAssets";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

export default function BrandProfile() {
  const { data: profile, isLoading } = useBrandProfile();
  const { data: assets } = useMarketingAssets();
  const { mutate: saveProfile, isPending: isSaving } = useUpsertBrandProfile();

  const [formData, setFormData] = useState<BrandProfileInput>({
    full_name: '',
    title: '',
    phone: '',
    email: '',
    license_number: '',
    company_name: '',
    office_address: '',
    company_phone: '',
    instagram_handle: '',
    facebook_handle: '',
    linkedin_handle: '',
    twitter_handle: '',
    primary_color: '#000000',
    secondary_color: '#ffffff',
    headshot_asset_id: null,
    logo_asset_id: null,
    bio: '',
    tagline: '',
    website_url: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        title: profile.title || '',
        phone: profile.phone || '',
        email: profile.email || '',
        license_number: profile.license_number || '',
        company_name: profile.company_name || '',
        office_address: profile.office_address || '',
        company_phone: profile.company_phone || '',
        instagram_handle: profile.instagram_handle || '',
        facebook_handle: profile.facebook_handle || '',
        linkedin_handle: profile.linkedin_handle || '',
        twitter_handle: profile.twitter_handle || '',
        primary_color: profile.primary_color || '#000000',
        secondary_color: profile.secondary_color || '#ffffff',
        headshot_asset_id: profile.headshot_asset_id,
        logo_asset_id: profile.logo_asset_id,
        bio: profile.bio || '',
        tagline: profile.tagline || '',
        website_url: profile.website_url || '',
      });
    }
  }, [profile]);

  const handleChange = (field: keyof BrandProfileInput, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(formData);
  };

  const headshotAssets = assets?.filter(a => a.type === 'headshot') || [];
  const logoAssets = assets?.filter(a => a.type === 'logo') || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brand Profile</h1>
          <p className="text-muted-foreground">
            Set up your brand information to auto-populate marketing materials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your name and contact details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={e => handleChange('full_name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="Licensed Real Estate Agent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email || ''}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    className="pl-10"
                    value={formData.phone || ''}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number || ''}
                  onChange={e => handleChange('license_number', e.target.value)}
                  placeholder="DRE# 01234567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website_url"
                    className="pl-10"
                    value={formData.website_url || ''}
                    onChange={e => handleChange('website_url', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brokerage Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Brokerage Information
              </CardTitle>
              <CardDescription>Your company and office details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={e => handleChange('company_name', e.target.value)}
                  placeholder="Bridge Real Estate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_phone">Office Phone</Label>
                <Input
                  id="company_phone"
                  value={formData.company_phone || ''}
                  onChange={e => handleChange('company_phone', e.target.value)}
                  placeholder="(555) 000-0000"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="office_address">Office Address</Label>
                <Input
                  id="office_address"
                  value={formData.office_address || ''}
                  onChange={e => handleChange('office_address', e.target.value)}
                  placeholder="123 Main St, Suite 100, New York, NY 10001"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Media
              </CardTitle>
              <CardDescription>Your social media handles (without @)</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagram_handle">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram_handle"
                    className="pl-10"
                    value={formData.instagram_handle || ''}
                    onChange={e => handleChange('instagram_handle', e.target.value)}
                    placeholder="yourhandle"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook_handle">Facebook</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="facebook_handle"
                    className="pl-10"
                    value={formData.facebook_handle || ''}
                    onChange={e => handleChange('facebook_handle', e.target.value)}
                    placeholder="yourpage"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_handle">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin_handle"
                    className="pl-10"
                    value={formData.linkedin_handle || ''}
                    onChange={e => handleChange('linkedin_handle', e.target.value)}
                    placeholder="yourprofile"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_handle">Twitter / X</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter_handle"
                    className="pl-10"
                    value={formData.twitter_handle || ''}
                    onChange={e => handleChange('twitter_handle', e.target.value)}
                    placeholder="yourhandle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Brand Assets & Colors
              </CardTitle>
              <CardDescription>Your logo, headshot, and brand colors</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="headshot_asset">Headshot</Label>
                <Select
                  value={formData.headshot_asset_id || 'none'}
                  onValueChange={v => handleChange('headshot_asset_id', v === 'none' ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select headshot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No headshot selected</SelectItem>
                    {headshotAssets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_asset">Logo</Label>
                <Select
                  value={formData.logo_asset_id || 'none'}
                  onValueChange={v => handleChange('logo_asset_id', v === 'none' ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select logo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No logo selected</SelectItem>
                    {logoAssets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="primary_color"
                    className="w-12 h-10 p-1 cursor-pointer"
                    value={formData.primary_color || '#000000'}
                    onChange={e => handleChange('primary_color', e.target.value)}
                  />
                  <Input
                    value={formData.primary_color || '#000000'}
                    onChange={e => handleChange('primary_color', e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="secondary_color"
                    className="w-12 h-10 p-1 cursor-pointer"
                    value={formData.secondary_color || '#ffffff'}
                    onChange={e => handleChange('secondary_color', e.target.value)}
                  />
                  <Input
                    value={formData.secondary_color || '#ffffff'}
                    onChange={e => handleChange('secondary_color', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio & Tagline */}
          <Card>
            <CardHeader>
              <CardTitle>Bio & Tagline</CardTitle>
              <CardDescription>Your professional biography and marketing tagline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline || ''}
                  onChange={e => handleChange('tagline', e.target.value)}
                  placeholder="Your trusted real estate partner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  rows={5}
                  value={formData.bio || ''}
                  onChange={e => handleChange('bio', e.target.value)}
                  placeholder="Tell clients about yourself, your experience, and your approach to real estate..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} size="lg">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Brand Profile
                </>
              )}
            </Button>
          </div>
      </form>
      </div>
    </MarketingLayout>
  );
}
