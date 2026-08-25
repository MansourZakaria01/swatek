-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "TechnologyDomain" AS ENUM ('AI', 'INDUSTRY_40', 'CIRCULAR_ECONOMY', 'ENERGY_HYDROGEN', 'AGRICULTURE_40', 'SMART_INFRASTRUCTURE');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('technology_partnership', 'project_development', 'investment', 'government_relation', 'technical_consulting', 'other');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('new', 'in_review', 'assigned', 'in_progress', 'closed');

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('technology', 'academic', 'financial', 'government', 'industry');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('whitepaper', 'case_study', 'technical_spec', 'brochure', 'report');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'viewer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnologyDomainRecord" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" "TechnologyDomain" NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "icon" TEXT,
    "heroImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechnologyDomainRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "benefitsEn" TEXT[],
    "benefitsFr" TEXT[],
    "benefitsAr" TEXT[],
    "energySavingsPct" DOUBLE PRECISION,
    "carbonReductionPct" DOUBLE PRECISION,
    "roiPeriodMonths" INTEGER,
    "images" TEXT[],
    "tags" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionTechnology" (
    "solutionId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,

    CONSTRAINT "SolutionTechnology_pkey" PRIMARY KEY ("solutionId","technologyId")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "geography" TEXT NOT NULL,
    "tags" TEXT[],
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "capacityMW" DOUBLE PRECISION,
    "productivityGainPct" DOUBLE PRECISION,
    "carbonReductionTons" DOUBLE PRECISION,
    "roiPct" DOUBLE PRECISION,
    "opCostReductionPct" DOUBLE PRECISION,
    "solutionId" TEXT,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeDocument" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "language" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "pageCount" INTEGER,
    "fileUrl" TEXT NOT NULL,
    "tags" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descFr" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "website" TEXT,
    "logo" TEXT,
    "type" "PartnerType" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpactMetric" (
    "id" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelFr" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "methodologyNote" TEXT,
    "dateMeasured" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "technologyId" TEXT,
    "caseStudyId" TEXT,

    CONSTRAINT "ImpactMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "organization" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "inquiryType" "InquiryType" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignedToId" TEXT,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InquiryNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inquiryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "InquiryNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TechnologyDomainRecord_slug_key" ON "TechnologyDomainRecord"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TechnologyDomainRecord_domain_key" ON "TechnologyDomainRecord"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_slug_key" ON "Technology"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Solution_slug_key" ON "Solution"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- AddForeignKey
ALTER TABLE "Technology" ADD CONSTRAINT "Technology_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "TechnologyDomainRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionTechnology" ADD CONSTRAINT "SolutionTechnology_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionTechnology" ADD CONSTRAINT "SolutionTechnology_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpactMetric" ADD CONSTRAINT "ImpactMetric_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpactMetric" ADD CONSTRAINT "ImpactMetric_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryNote" ADD CONSTRAINT "InquiryNote_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryNote" ADD CONSTRAINT "InquiryNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
