import { BehaviorSubject, Subject, filter } from "rxjs";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";

type SUPPORTED_LANGUAGES =
  | 'java17'
  | 'python3'
  | 'c12'
  | 'unsupported'

interface CodeDto {
  sourcecode: string;
  language: SUPPORTED_LANGUAGES;
}

interface ServerToClientEvents {
  "stdout": (output: string) => void;
  "stderr": (output: string) => void;
  "exit": (code: number | null) => void;
  "error": (msg: string) => void;
}

interface ClientToServerEvents {
  "run": (code: CodeDto) => void;
  "stdin": (input: string) => void;
  "kill": (sigkill: number | null) => void;
}

export type IO =
  | { type: 'stdin'; data: string }
  | { type: 'stdout'; data: string }
  | { type: 'stderr'; data: string }
  | { type: 'exit'; data: number | null };

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export class Runner {
  private static _instance: Runner;
  private static io: SocketType;

  private _isConnected = new BehaviorSubject<boolean>(false);
  private _output = new Subject<IO>();
  private _error = new Subject<string>();

  private constructor(){
    Runner.io = io(environment.baseUrl.toString(), {
      path: "/api/runner/v1/socket.io",
      autoConnect: false
    });

    Runner.io.on("connect", () => {
      this._isConnected.next(true);
      console.log("Connection established")
    });
    Runner.io.on("disconnect", () => {
      this._isConnected.next(false);
      console.log("Connection down")
    });
    Runner.io.on("connect_error", (err) => {
      this._isConnected.next(false);
      this._error.next("Connection error : " + err.message);
      console.log("Connection error: " + err.message);
    });

    Runner.io.on("stdout", data => this._output.next({ type: "stdout", data: data }));
    Runner.io.on("stderr", data => this._output.next({ type: "stderr", data: data }));
    Runner.io.on("exit", data => this._output.next({ type: "exit", data: data }));
    Runner.io.on("error", data => this._error.next(data));
  }

  public get isConnected$() {
    return this._isConnected.asObservable();
  }

  public get isConnected() {
    return this._isConnected.value;
  }

  public get output$() {
    return this._output
      .asObservable()
      .pipe(filter(i => i.type != 'stdin'));
  }

  public get error$() {
    return this._error.asObservable()
  }

  public static getInstance(): Runner {
    if (!this._instance)
      this._instance = new Runner();

    return this._instance;
  }

  public connect() {
    Runner.io.connect();
  }

  public disconnect() {
    Runner.io.disconnect();
  }

  public run(code: CodeDto) {
    if (this.isConnected) {
      console.log("Running code : ", code);
      Runner.io.emit("run", code);
    }
  }

  public input(data: string) {
    if (this.isConnected) {
      console.log("Input : ", { data });
      Runner.io.emit("stdin", data);
    }
  }

  public kill(sigkill: number | null = null) {
    if (this.isConnected) {
      console.log("Kill : ", { sigkill });
      Runner.io.emit("kill", sigkill);
    }
  }

}
