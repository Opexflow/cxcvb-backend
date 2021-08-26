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
  "thumbnail" varchar NOT NULL,
  "updatedAt" varchar NOT NULL,
  "remoteUpdatedAt" varchar NULL
);

ALTER TABLE "Video" ADD CONSTRAINT "pkVideo" PRIMARY KEY ("videoId");
ALTER TABLE "Video" ADD CONSTRAINT "fkVideoVideoType" FOREIGN KEY ("videoTypeId") REFERENCES "VideoType" ("videoTypeId");
