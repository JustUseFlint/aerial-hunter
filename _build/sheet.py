import sys,glob
from PIL import Image
pat,out,cols,w=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
fs=sorted(glob.glob(pat)); ims=[Image.open(f) for f in fs]
r=w/ims[0].width; ims=[im.resize((w,int(im.height*r))) for im in ims]
h=ims[0].height; rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(w*cols+4*(cols-1),h*rows+4*(rows-1)),(255,0,255))
for i,im in enumerate(ims): s.paste(im,((i%cols)*(w+4),(i//cols)*(h+4)))
s.save(out); print(len(fs))
