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

        score = {"version":1.0,"term":0,"notes":[[],[],[],[]],"slideNotes":[]}

        with open(name["suffixed"]+'.json', 'r', encoding="utf_8_sig") as f: 
                jsonData = json.load(f)

        wavfile = sys.argv[1]+'/'+name["base"]+'.wav'

        if os.path.isfile(wavfile):
                with wave.open(wavfile,'rb') as f:
                        rate = f.getframerate()
                        frames = f.getnframes()

                        milliseconds = round(frames/rate * 1000)
                        # print(milliseconds)
                        score['term'] = milliseconds + DELAY

        else:
                score['term'] = None
                print("Warning: File \"{}\" does not exist!\nCannot determine the term of the song.".format(wavfile), file=sys.stderr)

        offset = 1000 * jsonData["offset"] // rate
        if True: #name["suffixed"] == "REAL_EYEZ.hard":
            print(name["suffixed"])
            #print(jsonData["offset"])
            #print(rate)
            print("  offset: {} ms".format(offset))
        notes = jsonData["notes"]
        BPM = jsonData["BPM"]

        count = 0

        for note in notes:
                if note["type"] == 1:
                        expires =round(1000 * (note["num"] - 0 * note["LPB"] / jsonData["maxBlock"]) / note["LPB"] * 60 / BPM) + DELAY + offset
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

                        startExpires = round(1000 * startNote["num"] / startNote["LPB"] * 60 / BPM) + DELAY + offset
                        startLane = startNote["block"]
                        endExpires = round(1000 * endNote["num"] / endNote["LPB"] * 60 / BPM) + DELAY + offset
                        endLane = endNote["block"]

                        id = count
                        dic = {"startExpires":startExpires, "endExpires":endExpires, "startLane":startLane, "endLane":endLane, "id":id, "speed":1}
                        score["slideNotes"].append(dic)
                count += 1

        if len(sys.argv) >= 3 and sys.argv[2] == "nofoot":
            if score["slideNotes"] != []:
                print("Warning: File \"{}\" contains slide notes.".format(name["suffixed"]), file=sys.stderr)
                #sys.exit(1)
            score["slideNotes"] = []

        if not os.path.isdir(DESTDIR):
            os.mkdir(DESTDIR)

        s = json.dumps(score,indent=4)
        with open(os.path.join(DESTDIR, name["dest"]+'.json'), mode='w') as f:
                f.write(s)
