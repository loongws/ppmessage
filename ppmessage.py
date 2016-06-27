#!/usr/bin/env python

import sys
import importlib
import ppmessage

def _main():
    if len(sys.argv) == 1:
        ppmessage.backend._main()

if __name__ == "__main__":
    _main()

