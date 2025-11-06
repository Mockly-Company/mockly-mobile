# Node.js MCP SDK 서버 템플릿

완전한 TypeScript 기반 Node.js MCP SDK 서버 프로젝트 템플릿입니다.

## 프로젝트 구조

```
my-mcp-server/
├── src/
│   ├── index.ts          # 메인 서버 파일
│   ├── tools/           # 도구 모듈
│   │   ├── textTools.ts
│   │   └── dataTools.ts
│   └── types/           # 타입 정의
│       └── index.ts
├── dist/                # 컴파일된 출력
├── tests/              # 테스트
│   └── tools.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## package.json

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "description": "Custom MCP Server",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "typescript": "^5.0.0"
  }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## src/types/index.ts

```typescript
/**
 * 타입 정의
 */

export interface TextToolsArgs {
  countWords: {
    text: string;
  };
  extractEmails: {
    text: string;
  };
  extractUrls: {
    text: string;
  };
  formatText: {
    text: string;
    style: "uppercase" | "lowercase" | "title" | "capitalize";
  };
}

export interface DataToolsArgs {
  jsonToCsv: {
    jsonData: string;
  };
  csvToJson: {
    csvData: string;
  };
  validateJson: {
    jsonData: string;
  };
  calculateStats: {
    numbers: number[];
  };
}

export interface WordCountResult {
  words: number;
  characters: number;
  lines: number;
  avgWordLength: number;
}

export interface JsonValidationResult {
  valid: boolean;
  type?: string;
  size?: number;
  formatted?: string;
  error?: string;
  line?: number;
  column?: number;
}

export interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
}
```

## src/tools/textTools.ts

```typescript
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { TextToolsArgs, WordCountResult } from "../types/index.js";

export function registerTextTools(server: Server) {
  /**
   * 단어 수 세기
   */
  function countWords(text: string): WordCountResult {
    if (!text) {
      return {
        words: 0,
        characters: 0,
        lines: 0,
        avgWordLength: 0,
      };
    }

    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const lines = text.split("\n");

    return {
      words: words.length,
      characters: text.length,
      lines: lines.length,
      avgWordLength:
        words.length > 0
          ? words.reduce((sum, w) => sum + w.length, 0) / words.length
          : 0,
    };
  }

  /**
   * 이메일 추출
   */
  function extractEmails(text: string): string[] {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailPattern) || [];
    return [...new Set(emails)]; // 중복 제거
  }

  /**
   * URL 추출
   */
  function extractUrls(text: string): string[] {
    const urlPattern =
      /https?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/g;
    const urls = text.match(urlPattern) || [];
    return [...new Set(urls)];
  }

  /**
   * 텍스트 포맷팅
   */
  function formatText(
    text: string,
    style: "uppercase" | "lowercase" | "title" | "capitalize"
  ): string {
    switch (style) {
      case "uppercase":
        return text.toUpperCase();
      case "lowercase":
        return text.toLowerCase();
      case "title":
        return text.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      case "capitalize":
        return text.charAt(0).toUpperCase() + text.slice(1);
      default:
        throw new Error(`Unknown style: ${style}`);
    }
  }

  return {
    tools: [
      {
        name: "count_words",
        description: "텍스트의 단어 수를 세고 통계를 제공합니다",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "분석할 텍스트",
            },
          },
          required: ["text"],
        },
      },
      {
        name: "extract_emails",
        description: "텍스트에서 이메일 주소를 추출합니다",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "검색할 텍스트",
            },
          },
          required: ["text"],
        },
      },
      {
        name: "extract_urls",
        description: "텍스트에서 URL을 추출합니다",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "검색할 텍스트",
            },
          },
          required: ["text"],
        },
      },
      {
        name: "format_text",
        description: "텍스트를 지정된 스타일로 포맷팅합니다",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "포맷팅할 텍스트",
            },
            style: {
              type: "string",
              enum: ["uppercase", "lowercase", "title", "capitalize"],
              description: "적용할 스타일",
            },
          },
          required: ["text", "style"],
        },
      },
    ],
    handlers: {
      count_words: (args: any) => countWords(args.text),
      extract_emails: (args: any) => extractEmails(args.text),
      extract_urls: (args: any) => extractUrls(args.text),
      format_text: (args: any) => formatText(args.text, args.style),
    },
  };
}
```

## src/tools/dataTools.ts

```typescript
import { StatsResult, JsonValidationResult } from "../types/index.js";

export function registerDataTools() {
  /**
   * JSON을 CSV로 변환
   */
  function jsonToCsv(jsonData: string): string {
    const data = JSON.parse(jsonData);

    if (!Array.isArray(data)) {
      throw new Error("JSON은 배열 형태여야 합니다");
    }

    if (data.length === 0) {
      return "";
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        return typeof value === "string" ? `"${value}"` : value;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  }

  /**
   * CSV를 JSON으로 변환
   */
  function csvToJson(csvData: string): string {
    const lines = csvData.trim().split("\n");
    if (lines.length === 0) {
      return "[]";
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      result.push(obj);
    }

    return JSON.stringify(result, null, 2);
  }

  /**
   * JSON 검증
   */
  function validateJson(jsonData: string): JsonValidationResult {
    try {
      const data = JSON.parse(jsonData);

      return {
        valid: true,
        type: Array.isArray(data) ? "array" : typeof data,
        size: jsonData.length,
        formatted: JSON.stringify(data, null, 2),
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * 통계 계산
   */
  function calculateStats(numbers: number[]): StatsResult {
    if (numbers.length === 0) {
      throw new Error("숫자 목록이 비어있습니다");
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const n = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);

    return {
      count: n,
      sum,
      mean: sum / n,
      median: n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)],
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      range: Math.max(...numbers) - Math.min(...numbers),
    };
  }

  return {
    tools: [
      {
        name: "json_to_csv",
        description: "JSON 데이터를 CSV 형식으로 변환합니다",
        inputSchema: {
          type: "object",
          properties: {
            jsonData: {
              type: "string",
              description: "JSON 문자열 (배열 형태)",
            },
          },
          required: ["jsonData"],
        },
      },
      {
        name: "csv_to_json",
        description: "CSV 데이터를 JSON 형식으로 변환합니다",
        inputSchema: {
          type: "object",
          properties: {
            csvData: {
              type: "string",
              description: "CSV 문자열",
            },
          },
          required: ["csvData"],
        },
      },
      {
        name: "validate_json",
        description: "JSON 형식이 유효한지 검증합니다",
        inputSchema: {
          type: "object",
          properties: {
            jsonData: {
              type: "string",
              description: "검증할 JSON 문자열",
            },
          },
          required: ["jsonData"],
        },
      },
      {
        name: "calculate_stats",
        description: "숫자 목록의 통계를 계산합니다",
        inputSchema: {
          type: "object",
          properties: {
            numbers: {
              type: "array",
              items: { type: "number" },
              description: "숫자 배열",
            },
          },
          required: ["numbers"],
        },
      },
    ],
    handlers: {
      json_to_csv: (args: any) => jsonToCsv(args.jsonData),
      csv_to_json: (args: any) => csvToJson(args.csvData),
      validate_json: (args: any) => validateJson(args.jsonData),
      calculate_stats: (args: any) => calculateStats(args.numbers),
    },
  };
}
```

## src/index.ts

```typescript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { registerTextTools } from "./tools/textTools.js";
import { registerDataTools } from "./tools/dataTools.js";

// 서버 생성
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 도구 등록
const textTools = registerTextTools(server);
const dataTools = registerDataTools();

const allTools = [...textTools.tools, ...dataTools.tools];
const allHandlers = { ...textTools.handlers, ...dataTools.handlers };

// 도구 목록 핸들러
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: allTools,
  };
});

// 도구 실행 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const handler = allHandlers[name as keyof typeof allHandlers];

    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const result = handler(args);

    return {
      content: [
        {
          type: "text",
          text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
});

// 서버 실행
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP 서버가 시작되었습니다");
}

main().catch((error) => {
  console.error("서버 오류:", error);
  process.exit(1);
});
```

## README.md

```markdown
# My MCP Server (TypeScript)

TypeScript 기반 MCP 서버 - 텍스트 및 데이터 처리 도구 제공

## 설치

\`\`\`bash
npm install
\`\`\`

## 빌드

\`\`\`bash
npm run build
\`\`\`

## 실행

\`\`\`bash
npm start
\`\`\`

## 개발

\`\`\`bash
npm run dev  # 와치 모드로 빌드
\`\`\`

## 제공 도구

### 텍스트 도구
- count_words: 단어 수 및 통계
- extract_emails: 이메일 추출
- extract_urls: URL 추출
- format_text: 텍스트 포맷팅

### 데이터 도구
- json_to_csv: JSON → CSV
- csv_to_json: CSV → JSON
- validate_json: JSON 검증
- calculate_stats: 통계 계산

## Claude Desktop 설정

\`\`\`json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["/path/to/dist/index.js"]
    }
  }
}
\`\`\`
```

## 사용 방법

1. 프로젝트 생성 및 의존성 설치
2. 코드 작성 또는 템플릿 사용
3. `npm run build`로 빌드
4. `npm start`로 실행 테스트
5. Claude Desktop에 등록
