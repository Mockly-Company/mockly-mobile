# Framework-Specific Guides

Quick reference for enhancing prompts in popular frameworks.

## Frontend Frameworks

### React (Create React App / Vite)

**Key context to gather:**

- State management (Context, Redux, Zustand)
- Routing library (React Router)
- Component patterns (functional vs class)
- Build tool (Webpack, Vite)
- CSS approach

**Enhancement focus:**

```
- Component location: src/components/
- Hooks usage: useState, useEffect, custom hooks
- Route definitions: React Router configuration
- State structure: Global vs local state
- Build configuration: vite.config.ts or webpack config
```

## Backend Frameworks

### Express.js

**Key context to gather:**

- Middleware patterns
- Route organization
- Database/ORM (Prisma, TypeORM, Sequelize)
- Authentication approach
- TypeScript usage

**Enhancement focus:**

```
- Route structure: /routes directory
- Middleware: auth, validation, error handling
- Controllers: separation of concerns
- Database: ORM models and migrations
- Error handling: centralized error middleware
```

### Spring Boot

**Key context to gather:**

- Java/Kotlin language
- Spring version (Boot 2.x vs 3.x)
- Architecture pattern (Layered, Hexagonal)
- Database/ORM (JPA, MyBatis, QueryDSL)
- Security configuration (Spring Security)
- Build tool (Maven, Gradle)

**Enhancement focus:**

```
- Package structure: controller, service, repository, entity
- REST API: @RestController, @RequestMapping patterns
- Dependency Injection: @Autowired, @Service, @Repository
- Database: JPA entities, repository interfaces
- Exception handling: @ControllerAdvice, @ExceptionHandler
- Configuration: application.yml/properties
- Testing: JUnit 5, Mockito, @SpringBootTest
```

## Mobile Frameworks

### React Native

**Key context to gather:**

- Expo vs bare workflow
- Navigation library (React Navigation)
- State management
- Native modules usage
- Platform-specific code

**Enhancement focus:**

```
- Components: React Native primitives
- Navigation: stack, tab, drawer navigators
- Platform code: Platform.select()
- Native modules: linking and configuration
- Styling: StyleSheet API
```

## Enhancement Strategies by Framework

### For Component-Based Frameworks (React, Vue, Angular)

1. Check existing component structure
2. Identify state management pattern
3. Review prop/event patterns
4. Check testing approach (component tests)
5. Verify styling solution

## Quick Detection Commands

```bash
# Next.js
ls app/ pages/ next.config.js

# React
ls src/App.tsx package.json vite.config.ts

# React Native
ls App.tsx app.json

```

## Framework Version Considerations

### Breaking Changes to Note

- **Next.js 13+**: App Router vs Pages Router
- **React 18+**: Concurrent features, automatic batching
- **Spring Boot 3+**: Jakarta EE namespace

When enhancing prompts, always note the framework version if it affects implem
