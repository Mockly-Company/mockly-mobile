# Python FastMCP 서버 템플릿

완전한 Python FastMCP 서버 프로젝트 템플릿입니다.

## 프로젝트 구조

```
my-mcp-server/
├── server.py           # 메인 서버 파일
├── tools/             # 도구 모듈
│   ├── __init__.py
│   ├── text_tools.py
│   └── data_tools.py
├── requirements.txt   # 의존성
├── tests/            # 테스트
│   ├── __init__.py
│   └── test_tools.py
└── README.md         # 프로젝트 문서
```

## server.py

```python
"""
MCP 서버 메인 파일
"""
import logging
from fastmcp import FastMCP
from tools.text_tools import register_text_tools
from tools.data_tools import register_data_tools

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MCP 서버 초기화
mcp = FastMCP(
    "My MCP Server",
    version="1.0.0"
)

# 도구 등록
register_text_tools(mcp)
register_data_tools(mcp)

@mcp.tool()
def health_check() -> dict:
    """
    서버 상태를 확인합니다.

    Returns:
        서버 상태 정보
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "tools_count": len(mcp.list_tools())
    }

if __name__ == "__main__":
    logger.info("MCP 서버 시작 중...")
    mcp.run()
```

## tools/**init**.py

```python
"""도구 모듈 패키지"""
```

## tools/text_tools.py

```python
"""텍스트 처리 도구"""
import re
from typing import List

def register_text_tools(mcp):
    """텍스트 도구를 MCP 서버에 등록합니다."""

    @mcp.tool()
    def count_words(text: str) -> dict:
        """
        텍스트의 단어 수를 세고 통계를 제공합니다.

        Args:
            text: 분석할 텍스트

        Returns:
            단어 수, 문자 수, 줄 수를 포함한 통계
        """
        if not text:
            return {
                "words": 0,
                "characters": 0,
                "lines": 0,
                "avg_word_length": 0
            }

        words = text.split()
        lines = text.split('\n')

        return {
            "words": len(words),
            "characters": len(text),
            "lines": len(lines),
            "avg_word_length": sum(len(w) for w in words) / len(words) if words else 0
        }

    @mcp.tool()
    def extract_emails(text: str) -> List[str]:
        """
        텍스트에서 이메일 주소를 추출합니다.

        Args:
            text: 검색할 텍스트

        Returns:
            발견된 이메일 주소 목록
        """
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return list(set(emails))  # 중복 제거

    @mcp.tool()
    def extract_urls(text: str) -> List[str]:
        """
        텍스트에서 URL을 추출합니다.

        Args:
            text: 검색할 텍스트

        Returns:
            발견된 URL 목록
        """
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        urls = re.findall(url_pattern, text)
        return list(set(urls))

    @mcp.tool()
    def format_text(text: str, style: str) -> str:
        """
        텍스트를 지정된 스타일로 포맷팅합니다.

        Args:
            text: 포맷팅할 텍스트
            style: 스타일 (uppercase, lowercase, title, capitalize)

        Returns:
            포맷팅된 텍스트
        """
        styles = {
            "uppercase": text.upper(),
            "lowercase": text.lower(),
            "title": text.title(),
            "capitalize": text.capitalize()
        }

        if style not in styles:
            raise ValueError(f"알 수 없는 스타일: {style}. 사용 가능: {', '.join(styles.keys())}")

        return styles[style]
```

## tools/data_tools.py

```python
"""데이터 처리 도구"""
import json
import csv
from io import StringIO
from typing import List, Dict, Any

def register_data_tools(mcp):
    """데이터 도구를 MCP 서버에 등록합니다."""

    @mcp.tool()
    def json_to_csv(json_data: str) -> str:
        """
        JSON 데이터를 CSV 형식으로 변환합니다.

        Args:
            json_data: JSON 문자열 (배열 형태)

        Returns:
            CSV 형식 문자열
        """
        try:
            data = json.loads(json_data)

            if not isinstance(data, list):
                raise ValueError("JSON은 배열 형태여야 합니다")

            if not data:
                return ""

            # CSV 작성
            output = StringIO()
            writer = csv.DictWriter(output, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)

            return output.getvalue()

        except json.JSONDecodeError as e:
            raise ValueError(f"잘못된 JSON 형식: {e}")

    @mcp.tool()
    def csv_to_json(csv_data: str) -> str:
        """
        CSV 데이터를 JSON 형식으로 변환합니다.

        Args:
            csv_data: CSV 문자열

        Returns:
            JSON 형식 문자열
        """
        try:
            input_io = StringIO(csv_data)
            reader = csv.DictReader(input_io)
            data = list(reader)

            return json.dumps(data, indent=2, ensure_ascii=False)

        except Exception as e:
            raise ValueError(f"CSV 파싱 오류: {e}")

    @mcp.tool()
    def validate_json(json_data: str) -> dict:
        """
        JSON 형식이 유효한지 검증합니다.

        Args:
            json_data: 검증할 JSON 문자열

        Returns:
            검증 결과 및 정보
        """
        try:
            data = json.loads(json_data)

            return {
                "valid": True,
                "type": type(data).__name__,
                "size": len(json_data),
                "formatted": json.dumps(data, indent=2, ensure_ascii=False)
            }

        except json.JSONDecodeError as e:
            return {
                "valid": False,
                "error": str(e),
                "line": e.lineno,
                "column": e.colno
            }

    @mcp.tool()
    def calculate_stats(numbers: List[float]) -> dict:
        """
        숫자 목록의 통계를 계산합니다.

        Args:
            numbers: 숫자 배열

        Returns:
            평균, 중앙값, 최소값, 최대값 등의 통계
        """
        if not numbers:
            raise ValueError("숫자 목록이 비어있습니다")

        sorted_numbers = sorted(numbers)
        n = len(numbers)

        return {
            "count": n,
            "sum": sum(numbers),
            "mean": sum(numbers) / n,
            "median": sorted_numbers[n // 2] if n % 2 else (sorted_numbers[n // 2 - 1] + sorted_numbers[n // 2]) / 2,
            "min": min(numbers),
            "max": max(numbers),
            "range": max(numbers) - min(numbers)
        }
```

## requirements.txt

```
fastmcp>=0.1.0
pytest>=7.0.0
pytest-cov>=4.0.0
```

## tests/test_tools.py

```python
"""도구 테스트"""
import pytest
from tools.text_tools import register_text_tools
from tools.data_tools import register_data_tools
from fastmcp import FastMCP

@pytest.fixture
def mcp():
    """테스트용 MCP 인스턴스"""
    mcp = FastMCP("Test MCP")
    register_text_tools(mcp)
    register_data_tools(mcp)
    return mcp

def test_count_words():
    """단어 수 세기 테스트"""
    from tools.text_tools import register_text_tools
    mcp = FastMCP("Test")
    register_text_tools(mcp)

    # count_words 도구를 직접 호출할 수 없으므로
    # 실제 테스트는 도구 함수를 직접 임포트해야 합니다
    text = "Hello world! This is a test."
    # 여기서는 개념만 보여줍니다
    assert True

def test_extract_emails():
    """이메일 추출 테스트"""
    # 구현 예시
    assert True

def test_json_to_csv():
    """JSON to CSV 변환 테스트"""
    # 구현 예시
    assert True

# 추가 테스트...
```

## README.md

```markdown
# My MCP Server

이 MCP 서버는 텍스트 처리 및 데이터 변환 도구를 제공합니다.

## 설치

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## 실행

\`\`\`bash
python server.py
\`\`\`

## 제공 도구

### 텍스트 도구

- count_words: 단어 수 및 통계 계산
- extract_emails: 이메일 주소 추출
- extract_urls: URL 추출
- format_text: 텍스트 포맷팅

### 데이터 도구

- json_to_csv: JSON을 CSV로 변환
- csv_to_json: CSV를 JSON으로 변환
- validate_json: JSON 검증
- calculate_stats: 숫자 통계 계산

## 테스트

\`\`\`bash
pytest tests/ -v --cov
\`\`\`
```

## 사용 방법

1. 위 템플릿을 기반으로 프로젝트 생성
2. 필요한 도구 추가 또는 수정
3. 테스트 작성 및 실행
4. Claude Desktop에 등록하여 사용
