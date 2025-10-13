---
title: Image Organization
description: How images are organized and managed in the Takazudo Modular project
---

# Image Organization

This document describes how images are organized and managed in the Takazudo Modular: Panels project.

## Overview

Images for this project are **not hosted within the project repository or on the same domain**. Instead, they are centrally managed in the parent Takazudo Modular website project and served from that domain.

## Parent Project Location

Images are hosted on the main Takazudo Modular website:
- **Production URL**: https://takazudomodular.com/
- **Local Repository Path**: Defined in `.env` as `TAKAZUDO_MODULAR_LOCAL_LOCATION`
  - Example: `/Users/takazudo/repos/personal/takazudomodular`

## Image Directory Structure

All images are organized under a specific directory structure in the parent project:

```
{TAKAZUDO_MODULAR_LOCAL_LOCATION}/static/images/p/{IMAGE_SLUG}/
```

Where `{IMAGE_SLUG}` is a unique identifier for each image set (e.g., `zb40l-02-dual`, `40hp-dual-set1`).

## Image File Variants

Each image slug directory contains multiple size variants optimized for different screen resolutions and use cases:

### Responsive Image Variants

- `600w.webp` - Small screens (600px width)
- `900w.webp` - Medium screens (900px width)
- `1200w.webp` - Large screens (1200px width)
- `1600w.webp` - Extra large screens (1600px width)
- `2000w.webp` - High-resolution displays (2000px width)

### Additional Files

- `mercari.png` - Original PNG format (marketplace listing image)
- `ogp.jpg` - Open Graph Protocol image for social media sharing
- `metadata.json` - Image metadata and configuration

## Metadata Structure

Each image directory includes a `metadata.json` file containing:

```json
{
  "slug": "zb40l-02-dual",
  "blurhash": "UhJ$KYRj=wS5RQJUsmn%}pxDNIj[$ijZofo0",
  "width": 2001,
  "height": 2001,
  "aspectRatio": 100,
  "hasVariants": true,
  "hash": "ceedcfba2cd00613",
  "processedAt": "2025-09-14T13:25:47.906Z",
  "originalFormat": "png"
}
```

### Metadata Fields

- **slug**: Unique identifier for the image set
- **blurhash**: BlurHash string for progressive image loading placeholders
- **width**: Original image width in pixels
- **height**: Original image height in pixels
- **aspectRatio**: Aspect ratio percentage (height/width × 100)
- **hasVariants**: Boolean indicating if responsive variants exist
- **hash**: Content hash for cache busting
- **processedAt**: ISO timestamp of when images were processed
- **originalFormat**: Original source image format (png, jpg, etc.)

## Usage in This Project

When referencing images from this project (Panels), use the full URL path to the parent domain:

```tsx
// Example image URL structure
const imageUrl = `https://takazudomodular.com/static/images/p/{IMAGE_SLUG}/{SIZE}.webp`;

// Specific example
const imageUrl600 = 'https://takazudomodular.com/static/images/p/zb40l-02-dual/600w.webp';
```

## Benefits of This Architecture

1. **Centralized Asset Management**: All Takazudo Modular images in one location
2. **CDN Optimization**: Images served from the main domain can leverage CDN caching
3. **Reduced Repository Size**: Panels project stays lean without large image files
4. **Consistent Image Processing**: Single pipeline for image optimization and variant generation
5. **Progressive Loading**: BlurHash support for smooth loading experience

## Environment Configuration

To work with images locally, ensure the `.env` file contains:

```bash
TAKAZUDO_MODULAR_LOCAL_LOCATION=/Users/takazudo/repos/personal/takazudomodular
```

This allows development tools and scripts to access the parent project's image directory when needed.

## Image Processing Pipeline

Images are processed through an automated pipeline that:
1. Takes original source images (PNG/JPG)
2. Generates responsive WebP variants at multiple sizes
3. Creates BlurHash placeholders
4. Generates OGP images for social sharing
5. Stores metadata in JSON format
6. Maintains original files for reference

---

**Note**: When adding new images to the Takazudo Modular ecosystem, they should be added to the parent project repository, not this Panels project.