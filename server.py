from sys import exit
from pprint import pprint
from m2x.client import M2XClient
import SocketServer

# API key
KEY=''
# Device ID/key
DEVICE=''

client = M2XClient(key=KEY)
device = client.device(DEVICE)

lookup = {
        0 : 'skillreview_drills',
        1 : 'skillreview_drivers',
        2 : 'skillreview_miterSaw',
        3 : 'students',
        4 : 'log',
    }

def get_vals(device,tool_id):
    """
    Returns list of stream values (up to 1000)
    """
        
    stream_name = lookup[tool_id]
    values_with_stamp = device.stream(stream_name).values()[u'values']
    # We only need the values. Time stamp and other information does
    # not matter to us at all
    values = []
    for i in values_with_stamp :
        # Trimming down to six because website guys are lazy
        data = i[u'value']
        values.append(str(data[0:6]))
    return values

def student_check(student_id,tool_id,device=device):
    """
    Returns the response (g=true,b=false) if student_id is in the
    stream for the specific tool_id
    """
    vals = get_vals(device,tool_id)
    assert(len(vals) > 0)
    if student_id in vals:
        # Record who is current using this tool
        push(str((student_id,tool_id)))
        # device checks for char length of 1 for good
        return 'g'
    elif student_id not in vals:
        # device checks for char length > 5 for bad
        return 'a'
    else:
        print "student_check error"


def push(to_push,device=device,stream_id=4):
    """
    Push student_id & tool_id to selected device & stream
    """
    stream = device.stream(lookup[stream_id])
    stream.add_value(to_push)

def main():
    assert(student_check('Oliver',0) == 'g')
    assert(student_check('OLIVER',0) == 'a')

def server():
    HOST = ''
    PORT = 9191

    server = SocketServer.TCPServer((HOST,PORT), TCPHandler)
    server.serve_forever()

class TCPHandler(SocketServer.BaseRequestHandler):
    def handle(self):
        self.data = self.request.recv(32).strip()
        # For some reason we're only comparing the first 6 characters,
        # even though the entire thing is 32 chars
        data = self.data[0:6]
        print "received %s and trimmed to %s" % (self.data,data)
        # We're only comparing the drills stream for the demo.
        final = student_check(data,1)
        self.request.sendall(final)

if __name__ == '__main__' :
    main()
    print '"Tests" have been passed, running server'
    server()
