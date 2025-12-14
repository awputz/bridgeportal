import { Helmet } from "react-helmet-async";

interface SEOHelmetProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export const SEOHelmet = ({ title, description, path = "", image }: SEOHelmetProps) => {
  const siteUrl = "https://bridgeadvisorygroup.com";
  const fullUrl = `${siteUrl}${path}`;
  const defaultImage = "/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image || defaultImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};
