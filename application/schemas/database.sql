CREATE TABLE "VideoType" (
  "videoTypeId" bigint generated always as identity,
  "name" varchar NOT NULL
);

ALTER TABLE "VideoType" ADD CONSTRAINT "pkVideoType" PRIMARY KEY ("videoTypeId");
CREATE TABLE "Video" (
  "videoId" bigint generated always as identity,
  "stringId" varchar NOT NULL,
  "videoTypeId" bigint NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar NULL,
  "host" varchar NOT NULL,
  "source" varchar NOT NULL,
  "thumbnail" varchar NULL,
  "score" integer NOT NULL,
  "updatedAt" varchar NOT NULL,
  "remoteUpdatedAt" varchar NULL
);

ALTER TABLE "Video" ADD CONSTRAINT "pkVideo" PRIMARY KEY ("videoId");
CREATE UNIQUE INDEX "akVideoStringId" ON "Video" ("stringId");
ALTER TABLE "Video" ADD CONSTRAINT "fkVideoVideoType" FOREIGN KEY ("videoTypeId") REFERENCES "VideoType" ("videoTypeId");
CREATE TABLE "VideoTranslation" (
  "videoTranslationId" bigint generated always as identity,
  "videoId" bigint NOT NULL,
  "locale" varchar NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar NULL
);

ALTER TABLE "VideoTranslation" ADD CONSTRAINT "pkVideoTranslation" PRIMARY KEY ("videoTranslationId");
ALTER TABLE "VideoTranslation" ADD CONSTRAINT "fkVideoTranslationVideo" FOREIGN KEY ("videoId") REFERENCES "Video" ("videoId");