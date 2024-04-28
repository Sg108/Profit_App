'use client'
import Image from "next/image";
import XLSX from 'xlsx';
const partition: Record<string, number>= {'Charges':2,'P&L':2,'Realised trades':0,'Stock name':10,'Unrealised trades':0,'Disclaimer: ':0}
const notRequired : Record<string, string>={'':'nr','Realised trades':'nr','Unrealised trades':'nr'}
export default function Home() {
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);    // Use the library (xlsx or exceljs) to parse the Excel file
      // Example using xlsx:
      const d={j:5}
      //console.log(d.j);
      d.j+=5
      //console.log(d.j);
      const workbook = XLSX.read(data, { type: 'array' });
      const range = XLSX.utils.decode_range(workbook.Sheets.Sheet1['!ref'] as string)
      const sheet1 = workbook.Sheets.Sheet1
     // console.log(range);
      const r='A10:H24'
     // console.log(XLSX.utils.decode_range(r as string))
      const jsonData = [];
 
   
      
        const sh = workbook.Sheets.Sheet1;
        let count=0;
        let ind =0;
        let start=0;
        let prev=''
        const options:Record<string, any> = {};
        for(const cell in sh)
          {  
               if(cell[0]=='A')
                {
                  
                  if(sh[cell].v in partition)
                    {
                         if(!(prev in notRequired))
                          {
                              const ce = partition[prev] 
                              //console.log('ce',ce)
                              const obj = {s:{r:start-1,c:0},e:{r:start+count-1,c:ce}}
                              if(options[sh[cell].v]==undefined)
                                {
                                  options[sh[cell].v]=[]
                                }
                                options[sh[cell].v].push({range:obj,header:start})
                          
                            }
                              count=0;
                              start=parseInt(cell.substring(1))
                              prev=sh[cell].v
                         
                    }
                    count++;
                }                                                                                                         
              
          }
          const Data = []
          for(const data in options)
            {
              //console.log(data)
                  for(const opt of options[data])
                    {
                      const dataObject = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, {
                        range: opt.range,
                        header: opt.header
                     
                    })
                   // console.log(opt)
                    //console.log(dataObject)
                    Data.push(dataObject)
                    }
            }
          console.log(Data);
    }

     
      // Now you can work with the workbook object
      //
    
    
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
     
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
    
    </main>
  );
}
