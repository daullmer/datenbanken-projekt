import csv
import subprocess
import sys
from pathlib import Path

filename = sys.argv[1]
new_filename = filename.removesuffix(".csv") + "_formatted.csv"

with open(filename) as csv_file:
    with open(new_filename, 'w') as writer_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        csv_writer = csv.writer(writer_file, delimiter=';')
        csv_writer.writerow(["bikeid", "time", "lat", "long"])
        next(csv_reader, None)
        for row in csv_reader:
            csv_writer.writerow([row[11], row[1], row[5], row[6]])
            csv_writer.writerow([row[11], row[2], row[9], row[10]])