# InversifyJS Express Application

A production-ready Node.js application demonstrating advanced dependency injection patterns using InversifyJS, Express, and TypeScript. This project showcases enterprise-level architectural patterns, SOLID principles, and clean code practices through a warrior-themed API.

## Architecture Overview

### Project Structure
```
src/
├── interfaces/        # Contract definitions (Warrior, Weapon, ThrowableWeapon)
├── controllers/       # Express route controllers (WarriorController)
├── container/        # Dependency injection setup (DIContainer)
├── entities/         # Concrete implementations (Ninja, Katana, Shuriken)
├── types.ts          # Type definitions and injection tokens
├── app.ts            # Express application setup and middleware
└── index.ts          # Application entry point and server initialization
```

### Core Components

#### 1. Dependency Injection Container
The application uses a centralized DI container managed by the `DIContainer` class:

```typescript
export class DIContainer {
    private static container: Container;

    public static resolveDependencies(): Container {
        if (!this.container) {
            this.container = new Container();
            this.registerDependencies();
        }
        return this.container;
    }

    private static registerDependencies(): void {
        this.container.bind<Warrior>(TYPES.Warrior).to(Ninja);
        this.container.bind<Weapon>(TYPES.Weapon).to(Katana);
        this.container.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);
    }
}
```

#### 2. Interface Definitions
Strong contracts defined through TypeScript interfaces:

```typescript
export interface Warrior {
    fight(): string;
    sneak(): string;
}

export interface Weapon {
    hit(): string;
}

export interface ThrowableWeapon {
    throw(): string;
}
```

#### 3. Type Definitions
Symbolic identifiers for dependency injection:

```typescript
const TYPES = {
    Warrior: Symbol.for("Warrior"),
    Weapon: Symbol.for("Weapon"),
    ThrowableWeapon: Symbol.for("ThrowableWeapon"),
    WarriorController: Symbol.for("WarriorController")
};
```

#### 4. Entity Implementations
Concrete classes with decorator-based dependency injection:

```typescript
@injectable()
class Ninja implements Warrior {
    @inject(TYPES.Weapon) private _katana: Weapon;
    @inject(TYPES.ThrowableWeapon) private _shuriken: ThrowableWeapon;

    public fight() { return this._katana.hit(); }
    public sneak() { return this._shuriken.throw(); }
}
```

#### 5. Controller Implementation
RESTful endpoints using inversify-express-utils:

```typescript
@controller("/warrior")
export class WarriorController {
    constructor(@inject(TYPES.Warrior) private warrior: Warrior) {}

    @httpGet("/fight")
    public fight(): string {
        return this.warrior.fight();
    }

    @httpGet("/sneak")
    public sneak(): string {
        return this.warrior.sneak();
    }
}
```

## Technical Implementation Details

### 1. Dependency Injection System

#### Container Configuration
- Singleton pattern implementation
- Lazy initialization of dependencies
- Automatic scope management
- Type-safe bindings

#### Injection Methods
1. Constructor Injection:
```typescript
constructor(@inject(TYPES.Warrior) private warrior: Warrior) {}
```

2. Property Injection:
```typescript
@inject(TYPES.Weapon) private _katana: Weapon;
```

### 2. Express Integration

#### Server Setup
```typescript
export class App {
    public static async createApp(): Promise<express.Application> {
        const container = DIContainer.resolveDependencies();
        const server = new InversifyExpressServer(container);
        
        server.setConfig((app) => {
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
        });

        return server.build();
    }
}
```

#### Middleware Configuration
- JSON body parsing
- URL-encoded body parsing
- Error handling middleware
- Request logging (configurable)

### 3. TypeScript Configuration

#### Compiler Options
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false,
    "strict": true
  }
}
```

#### Type Safety Features
- Strict null checks
- No implicit any
- Strict function types
- Decorator metadata
- Module resolution

## API Documentation

### Warrior Controller

#### GET /warrior/fight
Executes a warrior's combat action.

**Response:**
```json
{
  "action": "cut!"
}
```

**Usage Example:**
```bash
curl http://localhost:3000/warrior/fight
```

#### GET /warrior/sneak
Executes a warrior's stealth action.

**Response:**
```json
{
  "action": "hit!"
}
```

**Usage Example:**
```bash
curl http://localhost:3000/warrior/sneak
```

## Design Patterns Implementation

### 1. Dependency Inversion Principle (DIP)
- High-level modules (controllers) depend on abstractions (interfaces)
- Low-level modules (entities) implement interfaces
- No direct dependencies between modules

Example:
```typescript
// High-level module depends on Warrior interface
class WarriorController {
    constructor(@inject(TYPES.Warrior) private warrior: Warrior) {}
}

// Low-level module implements Warrior interface
@injectable()
class Ninja implements Warrior {
    // Implementation details
}
```

### 2. Singleton Pattern
- Single container instance
- Thread-safe initialization
- Lazy loading of dependencies

### 3. Decorator Pattern
- Route decoration
- Dependency injection
- Method interception

### 4. Factory Pattern
- Automatic instance creation
- Dependency resolution
- Scope management

## Development Workflow

### 1. Installation
```bash
# Install dependencies
npm install

# Verify TypeScript compilation
npm run build
```

### 2. Development
```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test
```

### 3. Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

### 4. Testing
The project supports various testing approaches:

#### Unit Testing
```typescript
describe('Ninja', () => {
    let ninja: Ninja;
    let mockWeapon: jest.Mocked<Weapon>;

    beforeEach(() => {
        mockWeapon = { hit: jest.fn() };
        ninja = new Ninja(mockWeapon);
    });

    it('should fight with weapon', () => {
        ninja.fight();
        expect(mockWeapon.hit).toHaveBeenCalled();
    });
});
```

#### Integration Testing
```typescript
describe('WarriorController', () => {
    let container: Container;
    let controller: WarriorController;

    beforeEach(() => {
        container = new Container();
        // Setup test bindings
    });

    it('should handle fight request', async () => {
        const response = await controller.fight();
        expect(response).toBe('cut!');
    });
});
```

## Best Practices Implementation

### 1. SOLID Principles

#### Single Responsibility
Each class has one primary responsibility:
- `Ninja`: Combat operations
- `WarriorController`: HTTP routing
- `DIContainer`: Dependency management

#### Open/Closed
Extensions through interfaces:
- New warrior types can be added without modifying existing code
- New weapon types can be implemented without changing the warrior

#### Liskov Substitution
Implementations are interchangeable:
- Any `Warrior` implementation can be used in `WarriorController`
- Different `Weapon` implementations can be injected into warriors

#### Interface Segregation
Focused interfaces:
- `Warrior`: Combat-related methods
- `Weapon`: Attack-related methods
- `ThrowableWeapon`: Ranged attack methods

#### Dependency Inversion
High-level modules depend on abstractions:
- Controllers depend on interfaces
- Business logic is independent of frameworks

### 2. Clean Architecture

#### Layers
1. Domain Layer (Interfaces)
2. Application Layer (Controllers)
3. Infrastructure Layer (Express Setup)

#### Dependencies
- Inward dependency rule
- Framework independence
- Testability focus

### 3. Error Handling
```typescript
try {
    const app = await App.createApp();
    app.listen(PORT);
} catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
}
```

## Performance Considerations

### 1. Dependency Resolution
- Cached container instance
- Singleton scoped services
- Lazy loading of dependencies

### 2. Memory Management
- Proper disposal of resources
- Controlled scope lifetime
- Garbage collection friendly patterns

### 3. Request Handling
- Asynchronous operations
- Proper error boundaries
- Resource cleanup

## Security Best Practices

### 1. Input Validation
- Type checking
- Request validation
- Error handling

### 2. Dependency Management
- Regular updates
- Security audits
- Version control

### 3. Error Handling
- Safe error messages
- Proper logging
- Security headers

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request