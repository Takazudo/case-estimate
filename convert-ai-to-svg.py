#!/usr/bin/env python3
"""
Python script to convert AI files to SVG using Illustrator via AppleScript (macOS)
Requires Adobe Illustrator to be installed
"""

import os
import sys
import subprocess
from pathlib import Path
import argparse

def create_applescript(ai_file_path, svg_file_path):
    """Create AppleScript to convert single AI file to SVG"""
    script = f'''
    tell application "Adobe Illustrator"
        activate
        set theFile to POSIX file "{ai_file_path}"
        open theFile
        
        tell document 1
            export to POSIX file "{svg_file_path}" as SVG
        end tell
        
        close document 1 saving no
    end tell
    '''
    return script

def run_applescript(script):
    """Execute AppleScript"""
    try:
        result = subprocess.run(
            ['osascript', '-e', script],
            capture_output=True,
            text=True,
            check=True
        )
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def convert_ai_to_svg(input_path, output_path=None):
    """Convert single AI file or directory of AI files to SVG"""
    input_path = Path(input_path)
    
    if input_path.is_file():
        # Single file conversion
        if not input_path.suffix.lower() == '.ai':
            print(f"Error: {input_path} is not an AI file")
            return False
        
        if output_path:
            output_file = Path(output_path)
        else:
            output_file = input_path.with_suffix('.svg')
        
        print(f"Converting {input_path} to {output_file}")
        script = create_applescript(str(input_path.absolute()), str(output_file.absolute()))
        success, message = run_applescript(script)
        
        if success:
            print(f"✓ Successfully converted to {output_file}")
        else:
            print(f"✗ Failed to convert: {message}")
        
        return success
    
    elif input_path.is_dir():
        # Directory conversion
        ai_files = list(input_path.glob('*.ai'))
        
        if not ai_files:
            print(f"No AI files found in {input_path}")
            return False
        
        if output_path:
            output_dir = Path(output_path)
            output_dir.mkdir(parents=True, exist_ok=True)
        else:
            output_dir = input_path
        
        success_count = 0
        for ai_file in ai_files:
            output_file = output_dir / ai_file.with_suffix('.svg').name
            print(f"Converting {ai_file.name} to {output_file.name}")
            
            script = create_applescript(str(ai_file.absolute()), str(output_file.absolute()))
            success, message = run_applescript(script)
            
            if success:
                print(f"✓ Successfully converted {ai_file.name}")
                success_count += 1
            else:
                print(f"✗ Failed to convert {ai_file.name}: {message}")
        
        print(f"\nConversion complete: {success_count}/{len(ai_files)} files converted successfully")
        return success_count > 0
    
    else:
        print(f"Error: {input_path} is not a valid file or directory")
        return False

def main():
    parser = argparse.ArgumentParser(description='Convert Adobe Illustrator files to SVG')
    parser.add_argument('input', help='AI file or directory containing AI files')
    parser.add_argument('-o', '--output', help='Output SVG file or directory (default: same location as input)')
    
    args = parser.parse_args()
    
    if sys.platform != 'darwin':
        print("Warning: This script uses AppleScript and is designed for macOS.")
        print("For Windows, you would need to use COM automation or ExtendScript Toolkit.")
        return 1
    
    success = convert_ai_to_svg(args.input, args.output)
    return 0 if success else 1

if __name__ == '__main__':
    sys.exit(main())