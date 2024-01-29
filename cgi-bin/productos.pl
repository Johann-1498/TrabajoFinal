#!/usr/bin/perl
use strict;
use warnings;
use JSON;
use DBI;
my $table_data = getTable();
if ($table_data){
print $cgi->header(-type => 'application/json', -status => '200 OK');
print encode_json($table_data);
}else{
    print $cgi->header(-type => 'application/json', -status => '500 Internal Server Error');
    print '{"error": "Error al obtener los datos de la tabla"}'
}
sub getTable {
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "SELECT * FROM productos";
    my $sth = $dbh->prepare($query);
    $sth->execute();
    my @productos;
    
    while(my $fila = $sth->fetchrow_hashref) {
        push @productos, $fila;
    }
    $sth->finish;
    $dbh->disconnect;
    return \@productos; 
}