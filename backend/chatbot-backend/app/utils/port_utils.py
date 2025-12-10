import subprocess
import os
import platform

def kill_process_on_port(port):
    """
    Kills the process occupying the given port.
    """
    print(f"Attempting to free port {port}...")
    if platform.system() == "Windows":
        command = f'netstat -ano | findstr :{port}'
        try:
            output = subprocess.check_output(command, shell=True).decode()
            pids = []
            for line in output.splitlines():
                if f':{port}' in line and 'LISTENING' in line:
                    parts = line.strip().split()
                    if parts and parts[-1].isdigit():
                        pids.append(parts[-1])
            for pid in set(pids):
                print(f"  Found process with PID {pid} listening on port {port}. Attempting to terminate...")
                try:
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True, check=True)
                    print(f"  Successfully terminated PID {pid}.")
                except subprocess.CalledProcessError as e:
                    print(f"  Failed to terminate PID {pid}: {e}")
            if not pids:
                print(f"  No processes found listening on port {port}.")
        except subprocess.CalledProcessError:
            print(f"  No processes found listening on port {port}.")
    else: # Linux/macOS
        command = f"lsof -i tcp:{port} | grep LISTEN | awk '{{print $2}}'"
        try:
            output = subprocess.check_output(command, shell=True).decode()
            pids = output.strip().split('\n')
            for pid in set(pids):
                if pid:
                    print(f"  Found process with PID {pid} listening on port {port}. Attempting to terminate...")
                    try:
                        subprocess.run(f"kill -9 {pid}", shell=True, check=True)
                        print(f"  Successfully terminated PID {pid}.")
                    except subprocess.CalledProcessError as e:
                        print(f"  Failed to terminate PID {pid}: {e}")
            if not pids or all(not p for p in pids):
                print(f"  No processes found listening on port {port}.")
        except subprocess.CalledConledProcessError:
            print(f"  No processes found listening on port {port}.")

    print(f"Port {port} freeing attempt completed.")

if __name__ == "__main__":
    # Example usage (for testing purposes)
    # kill_process_on_port(8000)
    pass
