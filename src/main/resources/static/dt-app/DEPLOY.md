# 배포 가이드

이 문서는 dt-app을 GitHub Pages와 Spring Boot static 폴더에 배포하는 방법을 설명합니다.

## 1. GitHub Pages 배포

GitHub Actions를 통해 자동으로 배포됩니다.

### 자동 배포

- `main` 브랜치에 push하면 자동으로 빌드 및 배포됩니다
- GitHub Actions 워크플로우: `.github/workflows/deploy.yml`
- 배포 URL: `https://ssixth-team.github.io/dt-app/`

### 수동 빌드 (로컬 테스트용)

```bash
# GitHub Pages용 빌드 (BASE_PATH=/dt-app)
npm run build

# 빌드 결과물 미리보기
npm run preview
```

## 2. Spring Boot Static 폴더 배포

Spring Boot 프로젝트의 `static/dt-app/` 폴더에 배포할 때 사용합니다.

### 빌드 방법

```bash
# Spring Boot용 빌드 (BASE_PATH=/dt-app)
npm run build:spring
```

### 배포 방법

1. 위 명령어로 빌드 실행
2. `build/` 폴더의 모든 내용을 Spring Boot 프로젝트의 `static/dt-app/` 폴더로 복사

```bash
# Windows (PowerShell)
Copy-Item -Path "build\*" -Destination "경로\to\springboot\src\main\resources\static\dt-app\" -Recurse -Force

# Linux/Mac
cp -r build/* /path/to/springboot/src/main/resources/static/dt-app/
```

3. Spring Boot 애플리케이션 실행 후 접속
   - URL: `http://localhost:8080/dt-app/`

## 3. 경로 설정 원리

### BASE_PATH 설정

- GitHub Pages와 Spring Boot 모두 `/dt-app` base path를 사용합니다
- 환경변수 `BASE_PATH`로 제어됩니다
- `svelte.config.js`의 `paths.base` 설정에 반영됩니다

### 빌드 스크립트

- `npm run build`: GitHub Pages용 (`.github/workflows/deploy.yml`에서 `BASE_PATH=/dt-app` 설정)
- `npm run build:spring`: Spring Boot용 (명시적으로 `BASE_PATH=/dt-app` 설정)

### 생성된 HTML 확인

빌드 후 `build/index.html`을 확인하면 모든 리소스 경로가 `/dt-app/`로 시작합니다:

```html
<link rel="icon" href="/dt-app/favicon.svg" />
<script>
  {
    __sveltekit_v5jqm4 = {
      base: '/dt-app',
      assets: '/dt-app'
    };
  }
</script>
```

## 4. 문제 해결

### 경로 오류 발생 시

1. 빌드 시 `BASE_PATH` 환경변수가 올바르게 설정되었는지 확인
2. `build/index.html` 파일에서 경로가 `/dt-app/`로 시작하는지 확인
3. Spring Boot의 static 폴더 구조가 `static/dt-app/` 형태인지 확인

### 404 오류 발생 시

- SPA(Single Page Application)이므로 모든 경로는 `index.html`로 리다이렉트되어야 합니다
- Spring Boot에서 다음과 같은 설정이 필요할 수 있습니다:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/dt-app/{spring:[^\\.]*}")
                .setViewName("forward:/dt-app/index.html");
    }
}
```

## 5. 참고사항

- 두 배포 방식 모두 동일한 빌드 결과물을 사용합니다
- base path는 `/dt-app`으로 고정되어 있습니다
- 다른 base path가 필요한 경우 `BASE_PATH` 환경변수를 변경하여 빌드하세요
