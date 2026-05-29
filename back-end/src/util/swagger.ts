import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Worldcup Manager 2026 API',
      version: '1.0.0',
      description: 'API documentation for authentication, users, players, matches, and competition management.'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    tags: [
      { name: 'System', description: 'Service health endpoints' },
      { name: 'Auth', description: 'Authentication and current user profile' },
      { name: 'Users', description: 'Administrative user management' },
      { name: 'Players', description: 'Player catalog and status management' },
      { name: 'Matches', description: 'Match operations and goals' },
      { name: 'Competition', description: 'Tournament overview and round operations' }
    ],
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/status': {
        get: {
          tags: ['System'],
          summary: 'Service health check',
          security: [],
          responses: {
            '200': {
              description: 'Service is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' }
                    },
                    required: ['status']
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        UserRole: {
          type: 'string',
          enum: ['ADMIN', 'REFEREE', 'USER']
        },
        PlayerStatus: {
          type: 'string',
          enum: ['AVAILABLE', 'UNAVAILABLE']
        },
        MatchStatus: {
          type: 'string',
          enum: ['PLANNED', 'NOT_STARTED', 'IN_PROGRESS', 'FINISHED']
        },
        ApiError: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid request' }
          },
          required: ['message']
        },
        SafeUser: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx123abc' },
            username: { type: 'string', example: 'admin' },
            role: { $ref: '#/components/schemas/UserRole' },
            teamId: { type: 'string', nullable: true, example: 'clxteam01' }
          },
          required: ['id', 'username', 'role', 'teamId']
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/SafeUser' }
          },
          required: ['token', 'user']
        },
        Team: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Belgium' },
            country: { type: 'string', example: 'Belgium' },
            countryShortName: { type: 'string', example: 'BE' },
            countryFlag: { type: 'string', example: 'https://flagcdn.com/be.svg' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'name', 'country', 'countryShortName', 'countryFlag']
        },
        Player: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            teamId: { type: 'string' },
            firstName: { type: 'string', example: 'Kevin' },
            lastName: { type: 'string', example: 'De Bruyne' },
            shirtNumber: { type: 'integer', minimum: 1, example: 7 },
            position: { type: 'string', example: 'Midfielder' },
            status: { $ref: '#/components/schemas/PlayerStatus' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'teamId', 'firstName', 'lastName', 'shirtNumber', 'position', 'status']
        },
        PlayerWithTeam: {
          allOf: [
            { $ref: '#/components/schemas/Player' },
            {
              type: 'object',
              properties: {
                team: { $ref: '#/components/schemas/Team' }
              },
              required: ['team']
            }
          ]
        },
        Match: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            roundOrderNumber: { type: 'integer', minimum: 1, maximum: 4, example: 1 },
            roundName: { type: 'string', example: '8th Final' },
            homeTeamId: { type: 'string', nullable: true },
            awayTeamId: { type: 'string', nullable: true },
            refereeId: { type: 'string', nullable: true },
            homeScore: { type: 'integer', nullable: true, example: 2 },
            awayScore: { type: 'integer', nullable: true, example: 1 },
            matchDate: { type: 'string', format: 'date-time' },
            status: { $ref: '#/components/schemas/MatchStatus' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'roundOrderNumber', 'roundName', 'matchDate', 'status']
        },
        MatchWithRelations: {
          allOf: [
            { $ref: '#/components/schemas/Match' },
            {
              type: 'object',
              properties: {
                homeTeam: { $ref: '#/components/schemas/Team', nullable: true },
                awayTeam: { $ref: '#/components/schemas/Team', nullable: true },
                referee: { $ref: '#/components/schemas/SafeUser', nullable: true }
              }
            }
          ]
        },
        Goal: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            matchId: { type: 'string' },
            playerId: { type: 'string' },
            teamId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'matchId', 'playerId', 'teamId', 'createdAt']
        },
        GoalWithRelations: {
          allOf: [
            { $ref: '#/components/schemas/Goal' },
            {
              type: 'object',
              properties: {
                player: { $ref: '#/components/schemas/Player' },
                team: { $ref: '#/components/schemas/Team' }
              },
              required: ['player', 'team']
            }
          ]
        },
        MatchDetail: {
          allOf: [
            { $ref: '#/components/schemas/MatchWithRelations' },
            {
              type: 'object',
              properties: {
                goals: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/GoalWithRelations' }
                }
              },
              required: ['goals']
            }
          ]
        },
        TopScorer: {
          type: 'object',
          properties: {
            playerId: { type: 'string' },
            playerName: { type: 'string', example: 'Kevin De Bruyne' },
            teamName: { type: 'string', example: 'Belgium' },
            teamFlag: { type: 'string', example: 'https://flagcdn.com/be.svg' },
            goals: { type: 'integer', example: 5 }
          },
          required: ['playerId', 'playerName', 'teamName', 'teamFlag', 'goals']
        },
        CompetitionConfig: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'worldcup-manager-2026' },
            year: { type: 'integer', example: 2026 },
            hostCountry: { type: 'string', example: 'United States, Canada, Mexico' },
            format: { type: 'string', example: 'Knockout' }
          },
          required: ['name', 'year', 'hostCountry', 'format']
        },
        RoundConfig: {
          type: 'object',
          properties: {
            roundOrderNumber: { type: 'integer', minimum: 1, maximum: 4 },
            roundName: { type: 'string' },
            matches: { type: 'integer', minimum: 1 }
          },
          required: ['roundOrderNumber', 'roundName', 'matches']
        },
        StandingRow: {
          type: 'object',
          properties: {
            teamId: { type: 'string' },
            team: { type: 'string' },
            flag: { type: 'string' },
            p: { type: 'integer' },
            w: { type: 'integer' },
            d: { type: 'integer' },
            l: { type: 'integer' },
            gf: { type: 'integer' },
            ga: { type: 'integer' },
            gd: { type: 'integer' },
            pts: { type: 'integer' }
          },
          required: ['teamId', 'team', 'flag', 'p', 'w', 'd', 'l', 'gf', 'ga', 'gd', 'pts']
        },
        CompetitionOverview: {
          type: 'object',
          properties: {
            competition: { $ref: '#/components/schemas/CompetitionConfig' },
            rounds: {
              type: 'array',
              items: { $ref: '#/components/schemas/RoundConfig' }
            },
            teams: {
              type: 'array',
              items: { $ref: '#/components/schemas/Team' }
            },
            matches: {
              type: 'array',
              items: { $ref: '#/components/schemas/MatchWithRelations' }
            },
            standings: {
              type: 'array',
              items: { $ref: '#/components/schemas/StandingRow' }
            },
            topScorers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  playerId: { type: 'string' },
                  _count: {
                    type: 'object',
                    properties: {
                      playerId: { type: 'integer' }
                    },
                    required: ['playerId']
                  }
                },
                required: ['playerId', '_count']
              }
            }
          },
          required: ['competition', 'rounds', 'teams', 'matches', 'standings', 'topScorers']
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'newuser' },
            password: { type: 'string', format: 'password', example: 'Secret123!' }
          },
          required: ['username', 'password']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'admin' },
            password: { type: 'string', format: 'password', example: 'Secret123!' }
          },
          required: ['username', 'password']
        },
        UpsertPlayerRequest: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            shirtNumber: { type: 'integer', minimum: 1 },
            position: { type: 'string' },
            teamId: { type: 'string' },
            status: { $ref: '#/components/schemas/PlayerStatus' }
          },
          required: ['firstName', 'lastName', 'shirtNumber', 'position', 'teamId']
        },
        UpdatePlayerStatusRequest: {
          type: 'object',
          properties: {
            status: { $ref: '#/components/schemas/PlayerStatus' }
          },
          required: ['status']
        },
        UpdateMatchStatusRequest: {
          type: 'object',
          properties: {
            status: { $ref: '#/components/schemas/MatchStatus' }
          },
          required: ['status']
        },
        UpdateMatchResultRequest: {
          type: 'object',
          properties: {
            homeScore: { type: 'integer', minimum: 0 },
            awayScore: { type: 'integer', minimum: 0 }
          },
          required: ['homeScore', 'awayScore']
        },
        GoalRequest: {
          type: 'object',
          properties: {
            playerId: { type: 'string' },
            teamId: { type: 'string' }
          },
          required: ['playerId', 'teamId']
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true }
          },
          required: ['success']
        },
        UserListItem: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            role: { $ref: '#/components/schemas/UserRole' },
            teamId: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'username', 'role', 'teamId', 'createdAt']
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' }
            }
          }
        },
        Conflict: {
          description: 'Conflict',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' }
            }
          }
        }
      }
    }
  },
  apis: ['src/app.ts', 'src/controller/*.ts', 'dist/app.js', 'dist/controller/*.js']
});
