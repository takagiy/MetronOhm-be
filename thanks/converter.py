import json
import wave
import os
import sys

DELAY = 5000 #ms
DESTDIR = './dest'


filelist = os.listdir('.')
targetlist = []

for filename in filelist:
        try:
                name, diff, ext = filename.split('.')
                suffixed = name+'.'+diff
                dest = name+'.'+diff.lower()
                # extention = filename.split('.')[1]
        except:
                continue

        if ext == 'json' and os.path.isfile(filename) and name.find('converted') == -1:
                targetlist.append({"base": name, "suffixed": suffixed, "dest": dest})

for name in targetlist:

        with open(name["suffixed"]+'.json', 'r', encoding="utf_8_sig") as f: 
                jsonData = json.load(f)

        offset = jsonData["offset"] // 1000 + int(sys.argv[1])
        notes = jsonData["notes"]
        BPM = jsonData["BPM"]

        count = 0

        score = {"version":1.0,"term":0,"notes":[[],[],[],[]],"slideNotes":[]}

        for note in notes:
                if note["type"] == 1:
                        expires =(int)(1000 * note["num"] / note["LPB"] * 60 / BPM) + DELAY + offset
                        lane = note["block"]
                        id = count
                        dic = {"expires": expires, "id": id, "speed": 1}
                        #print(name["suffixed"])
                        if(lane >= 4):
                            continue
                        score["notes"][lane].append(dic)

                elif note["type"] == 2:
                        if(len(note["notes"]) < 1):
                            continue
                        startNote = note
                        endNote = note["notes"][0]

                        startExpires = (int)(1000 * startNote["num"] / startNote["LPB"] * 60 / BPM) + DELAY + offset
                        startLane = startNote["block"]
                        endExpires = (int)(1000 * endNote["num"] / endNote["LPB"] * 60 / BPM) + DELAY + offset
                        endLane = endNote["block"]

                        id = count
                        dic = {"startExpires":startExpires, "endExpires":endExpires, "startLane":startLane, "endLane":endLane, "id":id, "speed":1}
                        score["slideNotes"].append(dic)
                count += 1


        wavfile = name["base"]+'.wav'

        if os.path.isfile(wavfile):
                with wave.open(wavfile,'rb') as f:
                        rate = f.getframerate()
                        frames = f.getnframes()

                        milliseconds = (int)(frames/rate * 1000)
                        # print(milliseconds)
                        score['term'] = milliseconds + DELAY

        else:
                score['term'] = None
                print("Warning: File \"{}\" does not exist!\nCannot determine the term of the song.".format(wavfile), file=sys.stderr)


        if not os.path.isdir(DESTDIR):
            os.mkdir(DESTDIR)

        s = json.dumps(score,indent=4)
        with open(os.path.join(DESTDIR, name["dest"]+'.json'), mode='w') as f:
                f.write(s)
