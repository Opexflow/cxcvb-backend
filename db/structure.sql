ALTER TABLE "Video" ADD "videoTokens" TSVECTOR;
CREATE INDEX "videoTokensIdx" ON "Video" USING GIN ("videoTokens");
CREATE INDEX "stringIdIdx" ON "Video" ("stringId");