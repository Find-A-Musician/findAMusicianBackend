/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/login": {
    post: operations["login"];
  };
  "/logout": {
    /** Logout the current user */
    delete: operations["logout"];
  };
  "/refresh_token": {
    /** Send a new access token */
    post: operations["postRefreshToken"];
  };
  "/register": {
    post: operations["register"];
  };
  "/events": {
    /** Get a list of all the events */
    get: operations["getEvents"];
    /** Post a new event */
    post: operations["postEvents"];
    /** Delete an event */
    delete: operations["deleteEvents"];
    /** Modify an event info */
    patch: operations["patchEvent"];
  };
  "/genres": {
    /** Get a list of all genres */
    get: operations["getGenres"];
  };
  "/groups/invitation/response": {
    /** Respond to a group invitation */
    post: operations["responseGroupInvitation"];
  };
  "/groups": {
    /** Get a list of all the groups */
    get: operations["getGroups"];
    /** Create a new group */
    post: operations["createGroup"];
  };
  "/groups/invitation/send": {
    /** Invite a musician in a group */
    post: operations["sendGroupInvitation"];
  };
  "/instruments": {
    get: operations["getInstruments"];
  };
  "/musicians": {
    get: operations["getMusicians"];
  };
  "/profil": {
    /** Get the user connected profil */
    get: operations["getProfil"];
    delete: operations["deleteProfil"];
    patch: operations["patchProfil"];
  };
  "/test": {
    /** A simple get route for testing */
    get: operations["test"];
  };
}

export interface components {
  schemas: {
    musician: {
      id?: string;
      email: string;
      givenName?: string;
      familyName?: string;
      phone?: string | null;
      facebook_url?: string | null;
      twitter_url?: string | null;
      instagram_url?: string | null;
      promotion?: "L1" | "L2" | "L3" | "M1" | "M2";
      location?: "Douai" | "Lille";
      instruments?: components["schemas"]["instrument"][];
    };
    group: {
      id?: string;
      name: string;
      desription?: string;
      location: "Douai" | "Lille";
      genre: components["schemas"]["genre"][];
    } & {
      description: unknown;
    };
    groupMember: {
      givenName?: string;
      familyName?: string;
      instrument?: string;
      role?: "admin" | "member" | "declined";
    };
    instrument: {
      id: string;
      name: string;
    };
    genre: {
      id: string;
      name: string;
    };
    event: {
      id?: string;
      name: string;
      description: string;
      start_date: string;
      end_date: string;
      adress: string;
      admin?: components["schemas"]["musician"];
    };
    token: {
      accessToken: string;
      refreshToken: string;
    };
    httpError: {
      msg: string;
      stack?: string;
    };
  };
}

export interface operations {
  login: {
    responses: {
      /** Login successful */
      200: {
        content: {
          "application/json": {
            token: components["schemas"]["token"];
            musician: components["schemas"]["musician"];
          };
        };
      };
      /** The user is not find */
      400: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** invalid password */
      401: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          email?: string;
          password?: string;
        };
      };
    };
  };
  /** Logout the current user */
  logout: {
    responses: {
      /** All the token has been deleted */
      200: {
        content: {
          "application/json": string;
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
  /** Send a new access token */
  postRefreshToken: {
    responses: {
      /** a new access token */
      200: {
        content: {
          "application/json": {
            accessToken: string;
          };
        };
      };
      /** Invalid refresh token */
      401: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          refreshToken: string;
        };
      };
    };
  };
  register: {
    responses: {
      /** The user has been registered in the db */
      201: {
        content: {
          "application/json": {
            token: components["schemas"]["token"];
            musician: components["schemas"]["musician"];
            genres: components["schemas"]["genre"][];
            instruments: components["schemas"]["instrument"][];
          };
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          musician: components["schemas"]["musician"];
          password: string;
          genres: components["schemas"]["genre"][];
          instruments: components["schemas"]["instrument"][];
        };
      };
    };
  };
  /** Get a list of all the events */
  getEvents: {
    responses: {
      /** A list of all the events */
      200: {
        content: {
          "application/json": components["schemas"]["event"][];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
  /** Post a new event */
  postEvents: {
    responses: {
      /** The event has been created */
      201: {
        content: {
          "application/json": string;
        };
      };
      /** Event already created */
      401: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["event"];
      };
    };
  };
  /** Delete an event */
  deleteEvents: {
    responses: {
      /** The event has been deleted */
      200: {
        content: {
          "application/json": string;
        };
      };
      /** The user does not have the right */
      403: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** The event does not exist */
      404: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          event: string;
        };
      };
    };
  };
  /** Modify an event info */
  patchEvent: {
    responses: {
      /** The event has been deleted */
      200: {
        content: {
          "application/json": string;
        };
      };
      /** The user does not have the right */
      403: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** The event does not exist */
      404: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          id: string;
          name: string;
          description: string;
          start_date: string;
          end_date: string;
          adress: string;
        };
      };
    };
  };
  /** Get a list of all genres */
  getGenres: {
    responses: {
      /** A list of all genres */
      200: {
        content: {
          "application/json": components["schemas"]["genre"][];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
  /** Respond to a group invitation */
  responseGroupInvitation: {
    responses: {
      /** The user membershhip has been updated */
      201: {
        content: {
          "application/json": string;
        };
      };
      /** The user has already responded */
      400: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** User can't respond to this invitation */
      401: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          groupId: string;
          response: "declined" | "member";
        };
      };
    };
  };
  /** Get a list of all the groups */
  getGroups: {
    responses: {
      /** An array of groups */
      200: {
        content: {
          "application/json": {
            groupInformation: components["schemas"]["group"];
            groupMembers: components["schemas"]["groupMember"][];
          }[];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
  /** Create a new group */
  createGroup: {
    responses: {
      /** The group has been created */
      201: {
        content: {
          "application/json": string;
        };
      };
      /** An error in the request body */
      422: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          group: components["schemas"]["group"];
          genres?: components["schemas"]["genre"][];
          instrument: components["schemas"]["instrument"];
        };
      };
    };
  };
  /** Invite a musician in a group */
  sendGroupInvitation: {
    responses: {
      /** The user has been invited */
      201: {
        content: {
          "application/json": string;
        };
      };
      /** The user is already invited */
      400: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** User that invite doesn't have the access */
      401: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          groupId: string;
          musicianId: string;
          instrumentId: string;
          role: "lite_admin" | "member";
        };
      };
    };
  };
  getInstruments: {
    responses: {
      /** A list of all the instruments */
      200: {
        content: {
          "application/json": components["schemas"]["instrument"][];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
  getMusicians: {
    responses: {
      /** A list of all the musicians informations */
      200: {
        content: {
          "application/json": components["schemas"]["musician"][];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
  /** Get the user connected profil */
  getProfil: {
    responses: {
      /** The user profil information */
      200: {
        content: {
          "application/json": {
            musician: components["schemas"]["musician"];
            genres: components["schemas"]["genre"][];
            instruments: components["schemas"]["instrument"][];
          };
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
  deleteProfil: {
    responses: {
      /** The musician information has been updated */
      200: {
        content: {
          "application/json": string;
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
  patchProfil: {
    responses: {
      /** The musician information has been updated */
      200: {
        content: {
          "application/json": string;
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          email?: string;
          givenName?: string;
          familyName?: string;
          phone?: string;
          facebook_url?: string;
          twitter_url?: string;
          instagram_url?: string;
          promotion?: "L1" | "L2" | "L3" | "M1" | "M2";
          location?: "Douai" | "Lille";
          genres?: components["schemas"]["genre"][];
          instruments?: components["schemas"]["instrument"][];
        };
      };
    };
  };
  /** A simple get route for testing */
  test: {
    responses: {
      /** The test has been a success */
      200: {
        content: {
          "application/json": {
            userId: string;
          };
        };
      };
      /** Token not found */
      401: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Invalid token */
      403: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
      /** Error intern server */
      500: {
        content: {
          "application/json": components["schemas"]["httpError"];
        };
      };
    };
  };
}

export interface external {}
