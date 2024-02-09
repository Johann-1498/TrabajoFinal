#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
my $cgi = CGI->new;
my $value = $cgi->param('search');
my $table_search = searchTable();
if ($table_search){
print $cgi->header(-type => 'application/json', -status => '200 OK');
print encode_json($table_search);
}else{
    print $cgi->header(-type => 'application/json', -status => '500 Internal Server Error');
    print '{"error": "Error al obtener los datos de la tabla"}'
}
sub searchTable {
    my $dbh = DBI->connect("DBI:mysql:database=trabajofinal;host=localhost", "root", "753159", { RaiseError => 1 });
    my $query = "SELECT * FROM productos
WHERE LOWER(nombre) LIKE LOWER(?);";
    my $sth = $dbh->prepare($query);
    my $parametro_busqueda = $value;
    $sth->execute($parametro_busqueda);
    my @resultado;  
    while(my $fila = $sth->fetchrow_hashref) {
        push @resultado, $fila;
    }
    $sth->finish;
    $dbh->disconnect;
    return \@resultado; 
}