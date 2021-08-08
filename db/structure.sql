ALTER TABLE "Video" ADD "videoTokens" TSVECTOR;
CREATE INDEX "videoTokensIdx" ON "Video" USING GIN "videoTokens"