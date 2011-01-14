#!/usr/bin/env ruby

require 'rubygems'
require 'fastercsv'
require 'json'

def ensure_hashes(hash,*levels)
  cur_level = hash
  levels.each do |l|
    cur_level[l] ||= {}
    cur_level = cur_level[l]
  end
  cur_level
end

def write_json(prn,json)
  return unless prn
  out_file = "../api/ukprn/#{prn}.json"
  $stdout.print "."; $stdout.flush
  data = File.new(out_file,"w")
  data.write(JSON.generate(json))
  data.close
end

def read_json(prn)
  out_file = "../api/ukprn/#{prn}.json"
  File.exists?(out_file) ? JSON.parse(File.read(out_file)) : {}
end

def each_row(file)
  while (read = file.gets) do
    yield FasterCSV.parse_line(read)
  end
end

def clean_fieldnames(file)
  FasterCSV.parse_line(file.gets).map {|f| f.strip.gsub("\n","") }
end

def clean_value(value)
  if value.index("%")
    value = value.gsub("%","").to_i
  elsif
    value =~ /\d+/
    value = value.to_i
  end
end

def parse_files(files)
  files.each do |f|
    puts "PARSING #{f}"  

    file = File.new(f)
    fieldnames = clean_fieldnames(file)
    
    current_prn,json = nil, nil
  
    each_row(file) do |line|
      prn,*rest = line
    
      if prn != current_prn
        write_json(current_prn,json)
        json = read_json(prn)
      end
      current_prn = prn
      yield fieldnames,rest,json
    end  
    write_json(current_prn,json)
    puts 
  end
end
  
files = ["nss_full_time_2.csv","nss_full_time.csv"]
parse_files(files) do |fieldnames,row,json|
  institution,subject,level,question,*rest = row
  
  # Only interested in overall satisfaction question
  next unless question == "Q22"
  
  node = ensure_hashes(json,"courses",subject,level,"Full-time","satisfaction",question)
  rest.each_with_index do |value,i|
    next unless value
    node[fieldnames[i+5]] = clean_value(value)
  end
end

files = ["nss_part_time.csv"]
parse_files(files) do |fieldnames,row,json|
  institution,subject,level,question,*rest = row
  
  # Only interested in overall satisfaction question
  next unless question == "Q22"
  
  node = ensure_hashes(json,"courses",subject,level,"Part-time","satisfaction",question)
  rest.each_with_index do |value,i|
    next unless value
    node[fieldnames[i+5]] = clean_value(value)
  end
end

files = ["achievement.csv"]
parse_files(files) do |fieldnames,row,json|
 institution,subject,level,mode,*rest = row
 json["name"] = institution unless json["name"]
 node = ensure_hashes(json,"courses",subject,level,mode,"achievement")
 rest.each_with_index do |value,i|
   next unless value
   node[fieldnames[i+5]] = clean_value(value)
 end
end

files = ["continuation.csv"]
parse_files(files) do |fieldnames,row,json|
 institution,subject,level,mode,*rest = row
 node = ensure_hashes(json,"courses",subject,level,mode,"continuation")
 rest.each_with_index do |value,i|
   next unless value
   node[fieldnames[i+5]] = clean_value(value)
 end
end

files = ["context.csv"]
parse_files(files) do |fieldnames,row,json|
 institution,subject,*rest = row
 node = ensure_hashes(json,"context")
 rest.each_with_index do |value,i|
   next unless value
   node[fieldnames[i+3]] = clean_value(value)
 end
end

files = ["destination.csv"]
parse_files(files) do |fieldnames,row,json|
 institution,subject,destination,*rest = row
 node = ensure_hashes(json,"courses",subject,"destinations","Full-time",destination)
 rest.each_with_index do |value,i|
   break if i == 6
   next unless value
   node[fieldnames[i+4]] = clean_value(value)
 end
end

files = ["destination.csv"]
parse_files(files) do |fieldnames,row,json|
 institution,subject,destination,*rest = row
 node = ensure_hashes(json,"courses",subject,"destinations","Part-time",destination)
 rest.each_with_index do |value,i|
   next if i < 6
   next unless value
   node[fieldnames[i+4]] = clean_value(value)
 end
end

files = ["jobtype.csv"]
parse_files(files) do |fieldnames,row,json|
 institution,subject,level,mode,jobtype,*rest = row
 node = ensure_hashes(json,"courses",subject,level,mode,'jobtype',jobtype)
 rest.each_with_index do |value,i|
   next unless value
   node[fieldnames[i+6]] = clean_value(value)
 end
end

files = ["jobcat.csv"]
parse_files(files) do |fieldnames,row,json|
 institution,subject,category,*rest = row
 next unless category == "Graduate job"
 node = ensure_hashes(json,"courses",subject,"graduatejob","Full-time")
 rest.each_with_index do |value,i|
   break if i == 6
   next unless value
   node[fieldnames[i+4]] = clean_value(value)
 end
end

files = ["jobcat.csv"]
parse_files(files) do |fieldnames,row,json|
 institution,subject,category,*rest = row
 next unless category == "Graduate job"
 node = ensure_hashes(json,"courses",subject,"graduatejob","Part-time")
 rest.each_with_index do |value,i|
   next if i < 6
   next unless value
   node[fieldnames[i+4]] = clean_value(value)
 end
end
