# Live Code Collaboration IDE Project Documentation

## Project Overview

A real-time collaborative code editor that allows multiple users to write, share, and execute code together in the browser. Think Google Docs meets VS Code, but lightweight and free to host.

## Core Features

### 1. Real-time Collaboration

- Multi-user editing with cursor presence
- Conflict resolution using CRDT (Conflict-free Replicated Data Types)
- Room-based collaboration with shareable URLs

### 2. Code Editor Features

✅ Implemented:

- Monaco Editor integration with full syntax highlighting
- Support for multiple languages (JavaScript, Python, Java, C++)
- Real-time code execution and output display
- Modern UI with TailwindCSS
- Language selection dropdown
- Run button for code execution

To be added:

- Real-time cursor presence
- IntelliSense-like features

### 3. Code Execution

✅ Implemented:

- JavaScript: Direct browser execution with sandboxed environment
- Python: Browser-based execution using Pyodide WebAssembly
- Java: Remote execution using Piston API
- Error handling and output capture
- Support for both simple code snippets and full class definitions
- Automatic code wrapping for languages that require it

To be added:

- C++ execution
- Package/dependency management
- More language support

### 4. Development Environment

✅ Implemented:

- Modern React-based UI
- Monaco Editor integration
- Code execution service architecture
- Language-specific executors
- Error handling and output display
- Clean separation of concerns (services, components, types)

To be added:

- File system for projects
- Code sharing via URLs
- Console output improvements

## Technical Stack

### Frontend Stack

✅ Implemented:

- React.js for UI
- Monaco Editor
- TailwindCSS for styling
- TypeScript for type safety
- Vite for fast development and building

To be added:

- Y.js for CRDT
- Socket.io-client for real-time features

### Code Execution

✅ Implemented:

- JavaScript: Browser-based execution
- Python: Pyodide WebAssembly runtime
- Java: Piston API integration
- Modular executor architecture
- Error handling and output capture

To be added:

- More language support
- Local package management
- Execution history

### Backend Stack (All Free Tier)

- FastAPI on Railway (free tier)
- Redis Cloud (free 30MB)
- SQLite for database
- Judge0 CE (self-hosted on Railway free tier) if using Option B

## Deployment Costs Breakdown

Total Cost: $0-5/month

### Free Tier Options:

1. Frontend:

   - Vercel (free tier)
   - Netlify (free tier)
   - GitHub Pages (free)

2. Backend:

   - Railway (free tier includes 500 hours)
   - Fly.io (free tier includes 3 shared-cpu-1x apps)
   - Render (free tier)

3. Database:

   - SQLite (free, file-based)
   - Supabase (free tier)

4. Real-time:
   - Redis Cloud (free 30MB tier)

### Scaling Considerations

- Free tiers sufficient for development and small-scale use
- Can handle 50-100 concurrent users without paid upgrades
- Optional paid upgrades only needed for heavy usage

### Infrastructure

- WebSocket server for real-time communication
- Code execution service with isolation
- Authentication service
- Database service

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Rooms

```
POST /api/rooms/create
GET /api/rooms/{room_id}
POST /api/rooms/{room_id}/join
```

### Code Execution

```
POST /api/execute
GET /api/execution/{execution_id}/status
GET /api/execution/{execution_id}/output
```

### WebSocket Events

```
room:join - User joins a room
room:leave - User leaves a room
cursor:update - Cursor position update
text:update - Text content update
execution:start - Code execution started
execution:output - Execution output received
```

## Database Schema

### Users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT,
    created_at TIMESTAMP
);
```

### Rooms

```sql
CREATE TABLE rooms (
    id UUID PRIMARY KEY,
    name TEXT,
    language TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP
);
```

### RoomParticipants

```sql
CREATE TABLE room_participants (
    room_id UUID REFERENCES rooms(id),
    user_id UUID REFERENCES users(id),
    joined_at TIMESTAMP,
    PRIMARY KEY (room_id, user_id)
);
```

## Implementation Details

### Real-time Sync

- Use Y.js for text synchronization
- Implement operational transformation for conflict resolution
- Use Redis pub/sub for WebSocket scaling

### Code Execution

- Docker containers for isolated execution
- Resource limits and timeouts
- Support for multiple languages
- Package management within containers

### Security Considerations

- Rate limiting for API and WebSocket connections
- Input sanitization for code execution
- Room access control
- Secure WebSocket connections

## Deployment Architecture

```
Client -> CloudFlare -> Load Balancer -> WebSocket Servers
                                    -> API Servers
                                    -> Code Execution Workers
                                    -> Redis
                                    -> Database
```

## Future Enhancements

1. Git integration
2. Custom themes
3. More language support
4. Advanced IDE features (debugging, breakpoints)
5. Collaborative drawings/diagrams
6. Voice/video chat

## Development Phases

### Phase 1: Basic Editor

- Basic editor setup with Monaco
- Room creation and joining
- Real-time text sync
- User presence

### Phase 2: Code Execution

- Code execution environment
- Output streaming
- Basic language support
- File system implementation

### Phase 3: Advanced Features

- More languages
- Package management
- Terminal access
- Version control

### Phase 4: Polish

- UI/UX improvements
- Performance optimizations
- Security hardening
- Documentation

## Resource Requirements

- Free tier services sufficient for development
- Minimal hosting costs ($5-10/month)
- No special hardware needed

This documentation serves as a blueprint for implementing a collaborative IDE. Each component can be built incrementally, and the system can scale based on needs.
