import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useParams } from "react-router-dom";

const SEOComponent = () => {
  const { pageName } = useParams(); // Get the page name from the URL params

  // Ensure pageName is always valid
  const safePageName = pageName || "Home Page";

  const [seoData, setSeoData] = useState({
    title: `${safePageName} | Zang Global`, // Default title
    description: `Discover ${safePageName} on Zang Global, your trusted platform for exciting content.`,
    keywords: `${safePageName}, Zang Global, explore Innovation and  shop`,
    author: "Zang Global Team",
    robots: "index, follow",
    canonical: `https://www.merabestie.com/${safePageName.toLowerCase()}`,
    ogTitle: `${safePageName} | Zang Global`,
    ogDescription: `Explore ${safePageName} on Zang Global and discover amazing features for you and your friends!`,
    ogImage: "https://www.merabestie.com/static/images/og-image.jpg",
    ogUrl: `https://www.merabestie.com/${safePageName.toLowerCase()}`,
    twitterTitle: `${safePageName} | Zang Global`,
    twitterDescription: `Access exciting features on Zang Global for ${safePageName}.`,
    twitterImage: "https://www.merabestie.com/static/images/twitter-image.jpg",
  });

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const response = await axios.post("https://api.merabestie.com/seo/fetchSEOComponents", { pageName: safePageName });
        if (response.data) {
          setSeoData((prevData) => ({
            ...prevData,
            ...response.data, // Override default values with API response if available
          }));
        }
      } catch (error) {
        console.error("Failed to fetch SEO data:", error);
        // Default values will remain in use
      }
    };

    fetchSeoData();
  }, [safePageName]);

  return (
    <Helmet>
      <title>{seoData.title}</title>
      {seoData.description && <meta name="description" content={seoData.description} />}
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      {seoData.author && <meta name="author" content={seoData.author} />}
      {seoData.robots && <meta name="robots" content={seoData.robots} />}
      {seoData.canonical && <link rel="canonical" href={seoData.canonical} />}

      {/* Open Graph (OG) Tags */}
      {seoData.ogTitle && <meta property="og:title" content={seoData.ogTitle} />}
      {seoData.ogDescription && <meta property="og:description" content={seoData.ogDescription} />}
      {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
      {seoData.ogUrl && <meta property="og:url" content={seoData.ogUrl} />}

      {/* Twitter Tags */}
      {seoData.twitterTitle && <meta name="twitter:title" content={seoData.twitterTitle} />}
      {seoData.twitterDescription && <meta name="twitter:description" content={seoData.twitterDescription} />}
      {seoData.twitterImage && <meta name="twitter:image" content={seoData.twitterImage} />}
    </Helmet>
  );
};

export default SEOComponent;
