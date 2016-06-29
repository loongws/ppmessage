import os

def _main():
    _table = {}
    _file = os.path.join(os.path.dirname(__file__), "../resource/data/mandarin.dat")
    with open(_file, "r") as _f:
        _lines = _f.read().strip().split("\n")
        for _line in _lines:
            key, value = _line.split('\t', 1)
            _table[key] = value
            print _table[key], key

if __name__ == "__main__":
    _main()
