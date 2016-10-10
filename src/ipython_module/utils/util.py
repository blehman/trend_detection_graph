import logging
from datetime import datetime
import os
import sys
def build_logger(base_dir = 'log'):
    """
    Returns logger.
    """
    try:
        os.mkdir(base_dir)
    except FileExistsError:
        pass
    log = logging.getLogger()
    log.setLevel(logging.INFO)

    so = logging.StreamHandler(sys.stdout)
    so.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s|%(levelname)s::%(message)s')
    so.setFormatter(formatter)
    log.addHandler(so)

    log_file_name = base_dir+datetime.strftime(datetime.utcnow(), '%Y%m%dT%H%M%S') +'.log'
    fh = logging.FileHandler(log_file_name)
    fh.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s|%(levelname)s::%(message)s')
    fh.setFormatter(formatter)
    log.addHandler(fh)
    return log
