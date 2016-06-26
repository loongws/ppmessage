#!/usr/bin/env python

import sys
import ppmessage

def _main():
    if len(sys.argv) == 1:
        ppmessage.backend._main()

    elif len(sys.argv) == 2:
        if sys.argv[1] == "test_cert":
            ppmessage.unittest.apns.converter._main()

if __name__ == "__main__":
    _main()

